### [DOCKER 2.0](https://docs.docker.com/)

**Docker Compose — это инструментальное средство, входящее в состав Docker. Оно предназначено для решения задач, связанных с развёртыванием проектов.**

**Docker применяется для управления отдельными контейнерами (сервисами), из которых состоит приложение.**

**Docker Compose используется для одновременного управления несколькими контейнерами, входящими в состав приложения. Этот инструмент предлагает те же возможности, что и Docker, но позволяет работать с более сложными приложениями.**

#### Команды для запуска DOCKER:

        Base image
        FROM node:18-alpine

        Create app directory
        WORKDIR /usr/src/app

        A wildcard is used to ensure both package.json AND package-lock.json are copied
        COPY package*.json .

        Install app dependencies
        RUN npm install

        Bundle app source
        COPY . .

        Creates a "dist" folder with the production build
        RUN npm run build

        Start the server using the production build
        CMD [ "node", "dist/main.js" ]

В этом примере мы используем _FROM node:18-alpine_ для загрузки нашего образа по которому будет выстроен наш код и запущен контейнер.
Далее мы создаем директорию для работы нашего контейнера
После чего копируем необходимые зависимости в эту дирикторию
Запускаем установку зависимостей в директорию
Копируем файлы установленные, билдим и запускаем указав файл вхождения

#### Команды для запуска DOCKER-COMPOSE:

    widget:
        restart: on-failure
        build:
            context: ./server
            dockerfile: Dockerfile
        ports:
            - 4200:4200
        depends_on:
            - mongo
        volumes:
            - widget_data_container:/data/widget

Указываем название нашего контейнера
Указываем из какого контейнера будет запуск
Порт внешний(контейнера):Порт внутренний
Volumes: статические папки для файлов контейнера (_В случае падения контейнера, он перезапуститься и возьмет данные от туда_)
