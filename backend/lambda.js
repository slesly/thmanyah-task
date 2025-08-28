const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const serverlessExpress = require('@vendia/serverless-express');

let server;

async function bootstrap() {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'https://your-amplify-app.amplifyapp.com',
      credentials: true,
    });
    
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }
  return server;
}

exports.handler = async (event, context) => {
  const serverHandler = await bootstrap();
  return serverHandler(event, context);
};
