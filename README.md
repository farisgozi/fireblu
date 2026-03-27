# Empty Encore TS Template

## Developing locally

When you have [installed Encore](https://encore.dev/docs/ts/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=ts/empty
```

## Running locally
```bash
encore run
```

## Auth and Permissions

Set local JWT secret before testing authenticated endpoints:

```bash
encore secret set --type local AuthJWTSecret
```

Auth token requirements in this project:
- Header: `Authorization: Bearer <jwt>`
- Algorithm: `HS256`
- Issuer (`iss`): `fireblu-api`
- Audience (`aud`): `fireblu-clients`
- Subject (`sub`): required and mapped to `userID`
- Roles (`roles`): optional string array for role checks

Implemented endpoints:
- `GET /auth/ping`
- `GET /auth/is-auth` (requires auth)
- `GET /users/ping`
- `GET /users/me` (requires auth)
- `GET /permissions/my-roles` (requires auth)
- `POST /permissions/check-role` (requires auth)
- `GET /permissions/admin-check` (requires auth + `admin` role)

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!

## Testing

```bash
encore test
```
