[![GitHub license](https://img.shields.io/github/license/kpi-ua/ecampus.kpi.ua.svg)](https://github.com/kpi-ua/ecampus.kpi.ua/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/pulls/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
![Docker Image Version (latest by date)](https://img.shields.io/docker/v/kpiua/ecampus-kpi-ua)

[![GitHub watchers](https://img.shields.io/github/watchers/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Watch)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/watchers/)
[![GitHub forks](https://img.shields.io/github/forks/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Fork)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/network/)
[![GitHub stars](https://img.shields.io/github/stars/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Star)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/stargazers/)

# Electronic Campus of Igor Sikorsky Kyiv Polytechnic Institute

## Environment variables

- CAMPUS_API_BASE_PATH - Campus API URL. Dev value: `https://dev-api.campus.cloud.kpi.ua`
- COOKIE_DOMAIN - Cookie domain name. Dev value: `localhost`
- NEXT_PUBLIC_RECAPTCHA_KEY - Google ReCaptcha v3 public key. Dev value: `6LeMy30qAAAAAIC6KUhNfReP-Us5wkrkp3FLfOgl`

## Run project locally

```shell
npm i
npm run dev
```

## Build project for production

```shell
npm run build
```

## Run production build

```shell
npm run start
```

### Dun storybook

```shell
npm run storybook
```

## [Docker](https://hub.docker.com/r/kpiua/ecampus-kpi-ua)

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
 docker run --rm -it -e CAMPUS_API_BASE_PATH=https://dev-api.campus.cloud.kpi.ua -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```

or

```shell
docker run --rm -it \
  -e CAMPUS_API_BASE_PATH=https://dev-api.campus.cloud.kpi.ua \
  -e COOKIE_DOMAIN=localhost \
  -e NEXT_PUBLIC_RECAPTCHA_KEY=6LeMy30qAAAAAIC6KUhNfReP-Us5wkrkp3FLfOgl \
  -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```
