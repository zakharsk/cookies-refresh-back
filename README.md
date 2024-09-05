## General
This application uses the standard [NestJS](https://nestjs.com/) template with [Prisma](https://www.prisma.io/) and [Passport](https://www.passportjs.org/).
## Project setup
```sh
npm install
```
```sh
npx prisma migrate deploy
```
## Compile and run the project
```sh
npm run start:dev
```
## .env
You need to rename the `.env.example` file to `.env` and write any non-empty values for `ACCESS_JWT_SECRET` and `REFRESH_JWT_SECRET`.
The `ACCESS_JWT_EXPIRES_IN` and `REFRESH_JWT_EXPIRES_IN` values are used to set the lifetime of tokens, and to set the `Max-Age` parameter of the cookies being sent.
## Endpoints
- `/tokens`
    - `GET /tokens`
        - Get new tokens pair
        - Require `Authorization` header with `Bearer {token}` value. See above.
        - Returns nothing with `Set-Cookie` headers: `AccessToken` & `RefreshToken`
    - `PATCH /tokens`
        - Refresh tokens
        - Require `Cookie` header with `RefreshToken={jwt}`
        - Returns nothing with `Set-Cookie` headers: `AccessToken` & `RefreshToken`
    - `DELETE /tokens`
        - Delete hash of `RefreshToken` from the database
        - Requires `Cookie` header with `AccessToken={jwt}`
        - Returns nothing with `Set-Cookie` headers: empty `AccessToken` & `RefreshToken` with `Max-Age=0`
- `/users`
    - `GET /users`
        - Get full list of users
        - Require `Cookie` header with `AccessToken={jwt}`
        - Returns array of objects with limited user data:
          ```ts
          [
              {
                  id: string,
                  login: string,
              },
              { ... }
          ]
          ```
    - `GET /users/{userId}`
        - Get current user data
        - Require `Cookie` header with `AccessToken={jwt}`
        - Limited by current `userId`, extracted from `AccessToken`. You can't read data of another user.
        - Returns object with full user data:
          ```ts
          {
              id: string;
              login: string;
              passwordHash: string;
              refreshTokenHash: string;
              createdAt: string;
              updatedAt: string;
          }
          ```
    - `DELETE /users/{userId}`
        - Delete current user
        - Require `Cookie` header with `AccessToken={jwt}`
        - Limited by current `userId`, extracted from `AccessToken`. You can't delete another user.
        - Returns nothing
## REST API clients
In the root folder of the project there is a `REST_API_Clients` folder with files for importing into popular REST API clients: [Insomnia](https://insomnia.rest/), [Bruno](https://www.usebruno.com/) and general [OpenAPI](https://www.openapis.org/) specification.
## Authorization Bearer
To get Bearer token we need to take an object with authorization data:
```ts
const loginData = {
	login: user-login,
	password: user-password
}
```
Process all fields using `encodeURIComponent`:
```ts
loginData.login = encodeURIComponent(loginData.login);  
loginData.password = encodeURIComponent(loginData.password);
```
Convert an object to a string using `JSON.stringify`:
```ts
const jsonString = JSON.stringify(loginData);
```
Convert the received string to BASE64 format:
```ts
const b64String = btoa(jsonString);
```
The result should be used as a Bearer token. 
