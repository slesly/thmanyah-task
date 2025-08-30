import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS using environment variables
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://main.d19e30r7ro0wel.amplifyapp.com',
      'https://agd9mkwapi.us-east-1.awsapprunner.com'
    ];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`✅ Backend server is running on port ${port}`);
    console.log(`✅ Health check endpoint: http://localhost:${port}/search/health`);

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap(); 