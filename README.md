# Electronic Campus of Igor Sikorsky Kyiv Polytechnic Institute

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/kpiua/ecampus.kpi.ua)](https://hub.docker.com/r/kpiua/ecampus.kpi.ua)

The information system "Electronic Campus of Igor Sikorsky Kyiv Polytechnic Institute" is an automated system supporting educational process informatization. It provides digital communication tools for students, faculty, and department heads, enhancing educational quality through modern technology.

## Environment variables

* API_ENDPOINT - campus API location. Default value: `https://api.campus.kpi.ua/`
* OLD_UI_ADDRESS - location of 'classic' campus UI. Default value: `https://campus.kpi.ua/`
* LOGIN_PAGE_ADDRESS - location of login page. Used for redirect from external authorization providers. Default value: `https://ecampus.kpi.ua/login` 

## Build project
```shell
npm run build
```

## Run project
```shell
npm run start
```

## Docker

### Build container

```shell
docker build ./ --file ./Dockerfile --tag kpiua/ecampus-kpi-ua:latest
```

### Run
#### Run with default settings
```shell
docker run --rm -it -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```

#### Run with custom settings
```shell
 docker run --rm -it -e API_ENDPOINT=https://api-v2.campus.kpi.ua/ -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```
or
```shell
docker run --rm -it \
  -e API_ENDPOINT=https://api.local/ \
  -e OLD_UI_ADDRESS=https://old-ui.local/  \
  -e LOGIN_PAGE_ADDRESS_LINE=https://ecampus.local/login \
  -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```


#### Run locally for debug

Update _config.json_ file to set proper API endpoints and then run docker image:
```shell
docker-compose -f dev-docker-compose.yml up --build
```

