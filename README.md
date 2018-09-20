# Sample Passport.js Auth Webhook for Hasura GraphQL engine

This is a sample auth webhook for authenticating requests to the Hasura GraphQL engine.

### Deploy with Heroku (recommended)

1. Click the following button for deploying to Heroku.

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/arvi3411301/passport-js-auth-webhook)

2. Once it is deployed, we can create an user using `/signup` API like below:
  ```
     curl --header "Content-Type: application/json" \
      --request POST \
      --data '{"email": "test@hasura.io", "password": "test123", "confirmPassword": "test123"}' \
      http://localhost:8080/signup
  ```

3. On signup, we get below response:
  ```json
    {
      "id": 1,
      "username": "test@hasura.io",
      "token": "4ffd5ee92853787836325dcea74c02e4"
    }
  ```

4. Also, we can use `/login` API to fetch the user token,
  ```
     curl --header "Content-Type: application/json" \
      --request POST \
      --data '{"email": "test@hasura.io", "password": "test123"}' \
      http://localhost:8080/login
  ```

5. Webhook is available at `/webhook` API which accepts Authorization header to validate the token against an user.

## Usage with Hasura GraphQL engine

Once you have deployed this webhook, you can use it along with the GraphQL engine. You have to set the webhook URL as an environment variable in the docker container that runs the GraphQL engine.

*[Read the docs](https://docs.hasura.io/1.0/graphql/manual/auth/webhook.html).*

Send the `token` as a header  while making queries to the `graphql-engine`

```
{
  "Authorization": "Bearer <token>"
}
```
