import 'dotenv/config';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        // exceptionFactory: (errors) => new BadRequestException(errors)
    }));
    await app.listen(process.env.PORT || 4000);
}

bootstrap();
