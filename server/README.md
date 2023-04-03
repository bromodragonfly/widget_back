# [GONG 2.0](https://docs.nestjs.com/)

Описание динамичесикх модулей:</br>

    - BULL Module Queue. Работает под капотом с Redis (https://docs.nestjs.com/techniques/queues)
    - Mongoose module. Работает как обычный mongoose (https://docs.nestjs.com/recipes/mongodb#getting-started)

## Общее описание NestJS: </br>

NestJS фреймворк под капотом использующий express.
Главной его особенностью являеться то, что он диктует свои правила написния
что значительно облегчает построения модульности приложения.

**В server включена асинхронная функция, которая отвечает за загрузку нашего приложения:(main.ts)**

### СОСТОИТ ИЗ:

#### Controllers

    Cлой контроллеров отвечает за обработку входящих запросов и возврат ответа клиенту. Простой пример контроллера:

#### Providers

    Почти все является Providers — Service, Repository, Factory, Helper и т.д.
    Они могут быть внедрены в контроллеры и другие провайдеры. Если сказать языком Angular — то это все `@Injectables

#### Modules

    Модуль - это класс с декоратором Module(). Декоратор Module() предоставляет метаданные, которые Nest использует для организации структуры приложения.
    Каждое приложение Nest имеет как минимум один модуль, корневой модуль. Корневой модуль - это место, где Nest начинает упорядочивать дерево приложений.
    Фактически, корневой модуль может быть единственным модулем в вашем приложении, особенно когда приложение маленькое, но это не имеет смысла.
    В большинстве случаев у вас будет несколько модулей, каждый из которых имеет тесно связанный набор возможностей.
    В Nest модули по умолчанию являются синглетонами, поэтому вы можете без труда делить один и тот же экземпляр компонента между двумя и более модулями.

<b> Регистрация динамических модулей происходит посредством указания forRoot и forFeature.
<b> 1.forRoot используется для главной настройки и вызывается единожды
<b> 2.forFeature для каких-то дополнительных надстроек и может вызываться много раз в разных модулях

#### Middlewares

    Middlewares - это функция, которая вызывается перед обработчиком роута. Они имеют доступ к request и response. По сути они являются такими же как и в express.

#### Pipes

    Pipe преобразует входные данные в желаемый результат.
    Pipe должен реализовывать интерфейс PipeTransform.

    import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
    @Injectable()
    export class ValidationPipe implements PipeTransform {
        transform(value: any, metadata: ArgumentMetadata) {
    return value;
        }
    }

#### Guards

    Guards должны реализовывать интерфейс CanActivate. Guards имеют единственную ответсвенность.
    Они определяют, должен ли запрос обрабатываться обработчиком маршрута или нет.

#### Interceptors

    Перехватчики имеют ряд полезных возможностей, которые вдохновлены техникой Aspect-Oriented Programming (AOP).
    Они позволяют:
     *привязать дополнительную логику до / после выполнения метода;
     *преобразовать результат, возвращаемый функцией;
     *преобразовать исключение, выброшенное из функции;

#### Микросервисы

    Микросервис Nest - это просто приложение, которое использует другой транспортный уровень (не HTTP).
    Nest поддерживает два типа связи - TCP и Redis pub/sub, но новую транспортную стратегию легко внедрить, реализовав интерфейс CustomTransportStrategy.

**Пример**

    import { NestFactory } from '@nestjs/core';
    import { ApplicationModule } from './modules/app.module';
    import { Transport } from '@nestjs/microservices';

    async function bootstrap() {
    const app = await NestFactory.createMicroservice(ApplicationModule, {
        transport: Transport.TCP,
    });
     app.listen(() => console.log('Microservice is listening'));
    }
    bootstrap();
