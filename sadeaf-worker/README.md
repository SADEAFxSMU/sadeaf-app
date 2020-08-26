# sadeaf-worker

This module contains the background workers of the sadeaf app.
SADEAF worker is just a single node.js application with a fastify API for healthcheck interfacing.

## `./workers`

Logically independent AWS SQS based worker. 

## `./tests`

All worker should be tested, their test cases should in this directory.
This module uses [tap.js](https://github.com/tapjs/node-tap) test framework. 
