# ArgosJS (Panoptes)
A web-application that provides user-friendly interaction with smart-contracts on any blockchain network. It allows users to gather meaningful information from watching smart-contract events. 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Prerequisites
- [NodeJS](), version prior to 12.0.0
- [argos.js]() module: ``` npm install argosjs```
- Fill in the ```argos-config-template.js``` and rename it to ```argos-config.js```
- Also, point contract.export to your `$NEO4J_HOME$`

## Installation guide

### Docker

The solution is available on [Docker Hub](https://hub.docker.com/r/minhhoangdang/argosjs).

```bash
docker run \
    --name ArgosJS
    -p7474:17474 -p7473:17473 -p4200:14200 \
    -d \
    -v /path/to/config:/app/config \
    -v /path/to/models:/app/models \
    -v /path/to/neo4j/import:/var/lib/neo4j/import \
    argosjs:latest
```

### Manual installation
- Download [Neo4J Desktop](https://neo4j.com/download/)

- In neo4j.conf, add:
```
# APOC
apoc.export.file.enabled=true
apoc.import.file.enabled=true
apoc.import.file.use_neo4j_config=false
```
- Start the database

- Fill the config file `argos-config-template.js` and rename to `argos-config.js`

- Go to the example project folder
```bash
cd examples/ArgosJS/
```
- Launch the project
```bash
ng serve
```

- Go to `http://localhost:4200`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
