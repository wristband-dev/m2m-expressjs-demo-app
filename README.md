<div align="center">
  <a href="https://wristband.dev">
    <picture>
      <img src="https://assets.wristband.dev/images/email_branding_logo_v1.png" alt="Github" width="297" height="64">
    </picture>
  </a>
  <p align="center">
    Enterprise-ready auth that is secure by default, truly multi-tenant, and ungated for small businesses.
  </p>
  <p align="center">
    <b>
      <a href="https://wristband.dev">Website</a> •
      <a href="https://docs.wristband.dev/">Documentation</a>
    </b>
  </p>
</div>

<br>

---

<br>

# Wristband Machine-to-Machine Demo Server (Express / Node.js)

This is a Node.js Express server that demonstrates the following:
- How to acquire an access token on server startup for a machine-to-machine (M2M) OAuth2 client
- How to protect an API with access tokens
- How to refresh access tokens for the M2M OAuth2 client

<br>

---

## Requirements

Before installing, ensure you have:

- [Node.js](https://nodejs.org/) >= 20

<br>

## Getting Started

<br>

### 1) Sign up for a Wristband account.

First, make sure you sign up for a Wristband account at [https://wristband.dev](https://wristband.dev).

<br>

### 2) Provision the Express demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard. Once you land on the home page of the dashboard, click the "Add Application" button. Make sure you choose the following options:

- Step 1: Try a Demo
- Step 2: Subject to Authenticate - Machines
- Step 3: Client Framework - Node.js

You can also follow the [Demo App Guide](https://docs.wristband.dev/docs/setting-up-a-demo-app) for more information.

<br>

### 3) Apply your Wristband configuration values to the server

After completing demo app creation, you will be prompted with values to use for environment variables. You should see:

- `APPLICATION_VANITY_DOMAIN`
- `CLIENT_ID`
- `CLIENT_SECRET`

Copy those values, then create a `.env` file in the root of this repository:
```bash
cp .env.example .env
```

Open the `.env` file and paste in your values.

<br>

### 4) Install dependencies
```bash
npm install
```

<br>

### 5) Run the application

The Express server is exposed on port `6001`:
```bash
npm run dev
```

<br>

---

<br>

## How to Interact With The Server

Part of the server-startup process includes making a call to Wristband's Token Endpoint to acquire an access token for this server using the Client Credentials grant type. It will store the access token and expiration time in a cache.

**You will interact with this server by calling one of the data APIs.**

<br>

### Public Data API

`GET http://localhost:6001/api/public/data`

This is the endpoint you can hit from any command line or API testing tool (cURL, Postman, etc.) without passing any access token. When a request is sent to this API, the API will turn around and make an API call to the protected data API with the access token that was acquired during server startup. This is to simulate something akin to a microservices environment where an upstream service would be responsible for sending an access token with every downstream request.

Expected response:
```json
{
  "publicData": "hello world",
  "protectedData": "Here I am!!!"
}
```

<br>

### Protected Data API

`GET http://localhost:6001/api/protected/data`

This endpoint cannot be called without a valid access token. The `jwtAuthMiddleware` (implemented in this project) validates:
- The token signature using public keys from the Wristband JWKS endpoint
- The token is not expired
- The issuer matches your Wristband application domain
- The RS256 algorithm is specified

<br>

---

<br>

## Demo App Overview

<br>

### Entity Model

The entity model starts at the top with an application. The application has one M2M OAuth2 client through which the server will be authenticated.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-entity-model-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-entity-model-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-entity-model-light.png">
</picture>

<br>

### Architecture

The demo server consists of public APIs that can be called without an access token, and protected APIs that always require a valid access token in the request headers.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-architecture-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-architecture-light.png">
  <img alt="architecture" src="https://assets.wristband.dev/docs/m2m-client-expressjs-demo-app/m2m-client-expressjs-demo-app-architecture-light.png">
</picture>

<br>

### Getting New Access Tokens

The M2M auth client is initialized in `src/wristband.ts` and imported into the route handlers via `protectedApiClient` in `src/client/protected-api-client.ts`. With each request to a protected API, the Axios request interceptor retrieves the access token from the local memory cache as long as it exists and is not expired. If the token is missing or expired, a new token is fetched from Wristband's Token Endpoint using the Client Credentials grant type, cached, and then used for the request.

<br>

---

<br>

## Wristband TypeScript M2M Auth SDK

This demo app leverages the [Wristband typescript-m2m-auth SDK](https://github.com/wristband-dev/typescript-m2m-auth) for all M2M authentication interaction. Refer to that GitHub repository for more information.

<br>

## Wristband TypeScript JWT SDK

This demo app leverages the [Wristband typescript-jwt SDK](https://github.com/wristband-dev/typescript-jwt) for validating JWTs on protected APIs. Refer to that GitHub repository for more information.

<br>

## Questions

Reach out to the Wristband team at <support@wristband.dev> for any questions regarding this demo app.

<br/>
