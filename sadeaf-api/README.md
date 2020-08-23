# Setting up sadeaf-api in a DEV environment

1. Install [docker](https://docs.docker.com/get-docker/) & [docker-compose](https://docs.docker.com/compose/)
2. Install dependencies with `yarn install`
3. Run `yarn run dev`

# How it works

#### `/routes-v1` 
> Contains all the route prefixed with `/api/v1`

Services define routes within your application. 
Fastify provides an easy path to a microservice architecture, in the future you might want to independently deploy some of those.

#### `/plugins`

Plugins define behavior that is common to all the routes in your application. 
Authentication, caching, templates, and all the other crosscutting concerns should be handled by plugins placed in this folder.
