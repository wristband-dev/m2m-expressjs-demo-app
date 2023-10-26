# Wristband Machine-to-machine OAuth Client Demo Server (ExpressJS)

This is a NodeJS Server using ExpressJS to demonstrate how to protect APIs with access tokens in Wristband.  It consists of two REST APIs: one that can be called without the need for an access token, and another that always requires a valid access token in the request headers. The purpose of this server is to demonstrate how to acquire an access token on server startup for a machine-to-machine (M2M) OAuth client, how to protect an API with access tokens, and refresh the access tokens for the M2M OAuth2 client.
<br/>

## Create Your OAuth Client in Wristband

In your Wristband account, create a new application. You can put any value desired for the `loginUrl` since it is arbitrary in the absence of any user-facing interaction. Next, register a M2M Oauth2 Client for that application.  Copy off the client ID and secret as well as the application vanity domain.  You will need those values to configure environment variables for this server.

## Setup and Start the Server

From the root of this project, paste the values for application vanity domain, client ID, and client secret into the `.env` file.  Next, install all server dependencies required by the server by running the command `npm install`. Finally, either the `npm run dev` command or the `npm start` command to start the server.  The server will start on port 6001.

## Acquiring an Access Token for the Server

Part of the server-startup process includes making a call to Wristband's `/token` endpoint to acquire an access token for this server using the Client Credentials grant type.  It will store the token, the access token expiration time, and a boolean flag that acts as a lock into local memory cache for later use.

You will interact with the server by calling the public data API.

## Demo Server Endpoints

### Public Data API

`GET http://localhost:6001/api/public/data`

This is the endpoint you can hit from any command line or API testing tool (cURL, Postman, etc.) without passing any access token.  When a request is sent to this API, the API will turn around and make an API call to the protected data API with the access token that was acquired during server startup.  This is to simulate something akin to a microservices environment where an upstream service would be responsible for sending an acess token with every downstream request. The expected response output of this API is:

`{ publicData: "hello world", protectedData: "here I am" }`

### Protected Data API

`GET http://localhost:6001/api/protected/data`

This endpoint is the downstream API called by the public data API, and it cannot be called without a valid access token.  When this API is invoked, amiddleware is used to validate the following:
- The access token is present in the Authorization header (format = `Authorization: Bearer <access_token>`)
- The signature is valid when using the public keys as obtained from the Wristband JWKS endpoint.
- The access token is not expired.

## Getting New Access Tokens

There is an Axios request interceptor attached to the Protected API Client that is used for making requests to the protected data API from the public data API controller.  With each request made, that interceptor checks that an access token exists in the local memory cache and is also not expired.  If both conditions are met, it will stick the access token in the Authorization header automatically.  Otherwise, it won't proceed with the original downstream request until an attempt to get a new access token is complete.  Wristband's `/token` endpoint gets called with the Client Credentials grant type to get a new token, and the new token will be saved to local memory cache along with the new expiration time.
