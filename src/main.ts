import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('English Conversations API')
    .setDescription('A RESTful API for the English Conversations web app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    customSiteTitle: 'English Conversations API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { background-color: #000000; }
      #logo_small_svg__SW_TM-logo-on-dark { display: none;}
      .swagger-ui .topbar .topbar-wrapper::before {
        content: '';
        background-image: url('/logo.png'); 
        background-repeat: no-repeat;
        background-size: contain;
        height: 80px; 
        width: 250px;
        display: inline-block;
        margin-right: 10px;
      }
    `,
  };

  SwaggerModule.setup('docs', app, documentFactory, swaggerOptions);
  await app.listen(3000);
}
bootstrap();
