import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application...');
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${process.env.PORT || 3001}`);
    console.log(`🗄️ Database Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`🗄️ Database Port: ${process.env.DB_PORT || 5432}`);
    console.log(`🗄️ Database Name: ${process.env.DB_DATABASE || 'thmanyahdb'}`);
    console.log(`👤 Database User: ${process.env.DB_USERNAME || 'postgres'}`);

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
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`✅ Application started successfully!`);
    console.log(`✅ Health check endpoint: http://localhost:${port}/health`);

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap(); 