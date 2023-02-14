import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 4200;

    const app = await NestFactory.create(AppModule, {
      logger: ['debug', 'error'],
    });

    await app
      .listen(PORT)
      .then(() => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
