import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Accept,X-Requested-With,application/json,Access-Control-Allow-Headers,Authorization',
  });

  const options = new DocumentBuilder()
  .setTitle('Products')
  .setDescription('My description')
  .setVersion('1.0')
  .addTag('Product')
  .build();

  const document = SwaggerModule.createDocument( app, options);

  SwaggerModule.setup('api/docs', app, document);  

  await app.listen(AppModule.port);
}
bootstrap();
