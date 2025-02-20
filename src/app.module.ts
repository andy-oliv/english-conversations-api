import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        redact: ['id', 'password'],
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: { colorize: true },
            },
            {
              target: '@logtail/pino',
              level: 'debug',
              options: {
                sourceToken: process.env.BETTERSTACK_TOKEN,
                options: {
                  endpoint: 'https://s1210770.eu-nbg-2.betterstackdata.com',
                },
              },
            },
          ],
          options: {
            colorize: true,
          },
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets', 'images'),
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
