# About
This is a boilerplate project for NestJS with authentication. Use it as a base to add JWT-based auth guards to your applications.

# Technologies being used


[<img src="https://img.shields.io/badge/NestJS-EA2950"></img>](https://nestjs.com/)
[<img src="https://img.shields.io/badge/Postgres-669BC5"></img>](https://www.postgresql.org/)
[<img src="https://img.shields.io/badge/UseBruno-F5AB41"></img>](https://www.usebruno.com/)
[<img src="https://img.shields.io/badge/bcrypt-341144"></img>](https://www.npmjs.com/package/bcrypt)

# User class

```mermaid
classDiagram
    class User{
        number id
        String fullNmae
        String email
        String[] roles
        String password
        Date createdAt
        Date updateAt
        Date deletedAt
    }
```

# Getting started

Copy and fill .env file
```bash
cp -R .env.example .env
```

Install all the packages
```bash
npm i
```

Run (development mode)
```bash
npm run start:dev
```

You can turn off the database logging at `app.module.ts`


# Plannings

* [x] Communication with Postgres
* [x] User Class
* [x] JWT Auth
* [x] Use Guards and Strategies
* [x] Bcrypt passwords
* [ ] User CRUD endpoints
* [x] Protect endpoints by user role
* [ ] ts-check documentation
