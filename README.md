# VoyaCode (Server)

This repository contains the backend code for my website, [voyacode.com](https://www.voyacode.com/). If you want to know more about the website in general, you can check its repository [here](https://github.com/Voya100/VoyaCode).

## Technologies

The website uses Node.js server written in TypeScript. [NestJS](https://docs.nestjs.com/) is used as a framework, and the code mostly follows the structure provided by it. PostgreSQL is used as the database and [TypeORM](http://typeorm.io/#/) is used to map database entities to TypeScript classes and vice versa.

### Validation

Input validation is done with [class-validator](https://github.com/typestack/class-validator). This validation tool is integrated with TypeORM's entity classes and NestJS's ValidationPipe mechanism.

Validation work is mostly concentrated in entity classes, and this validation is ran by service classes before they attempt to save the entity to database. Upon failure a BadRequestException is thrown.

DTOs (data transfer objects), that are verified with the help of ValidationPipe, may also contain some input validation. However, if DTO represents properties of some entity, they generally won't be checked in them unless those properties are needed before entity validation takes place. This is to reduce unnecessary double validation.

### Testing

Jest is used for testing. Tests are split into two categories: unit tests (.spec.ts) and end-to-end tests (.spec-e2e.ts). Unit tests are located next to the class file that they test, and end-to-end tests are located inside [/test](test) directory.

In tests the focus is slightly more on e2e tests, because those give better results on the server's overall functionality, and they are very easy to implement. A real database (separate from dev/production) is used for the tests to increase their accuracy. The test database gets cleaned between each test suit.

### Directory structure

The codebase uses very modular structure where each 'feature' is in their own module. Responsibility roles are clearly defined by the file extensions:
- Entity (.entity.ts): Represents database schema and includes validation
- Data transfer object (.dto.ts/.dtos.ts): Includes data transfer object schema(s), generally used in Controllers to validate user input.
- Controller (.controller.ts): Resolves routes. May perform actions by calling services. Formats and returns the successful response to the user.
- Service (.service.ts): Handles more complex operations which may involve 'external' entities, such as database or requests to other services.
- Module (.module.ts): Brings together classes that belong to same module, handles dependency injection of its components.
- Exception filters (-exception.filter.ts): Catches exceptions thrown by other classes and formats a suitable response to user. Some are global, and some route specific. These are located at [/src/common/exception-filters](/src/common/exception-filters), as they often aren't directly related to any specific module.

Each module generally has their own directory, and submodules are often imported by their 'parent' modules. Path resolving logic is located in [/src/api](/src/api). It contains most of the server logic and its 'features'. [CoreModule](/src/core) contains generally useful services that could be needed by multiple features, such as email and encryption. [/src/common](/src/common) contains other useful features thay may be needed.

Codebase uses aliases to resolve paths so that it doesn't need to use long relative paths (example: '@core/core.module.ts' instead of '../../../../core.module.ts'). These are defined in [tsconfig.json](/tsconfig.json) file.

## Features

The website manages all website related APIs, possible redirects and other online features that could be needed. File hosting is generally done by Nginx (not included here), but server can also host files if the request does come through it. This is especially useful in local development environment. If request doesn't match any file or path, frontend's index.html file will be served (not in the scope of this repository).

It is worth noting that many of the features of the site, such as the ability to post blogs, is limited to the site admin. This means that you won't be able to try them all out on the website.

As of 10.07.2018, the main features of the server are:
- Admin authentication
- Blogs API (CRUD)
- Blog RSS feed (updated automatically, cached)
- Blog newsletter (email confirmation, email subscription, email unsubscription [with email encryption])
- Comments API (CRUD)

If you find a bug in the code, have feedback/suggestions or anything else to say, feel free to make an issue. :)
