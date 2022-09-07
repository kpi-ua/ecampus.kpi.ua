[![GitHub license](https://img.shields.io/github/license/kpi-ua/ecampus.kpi.ua.svg)](https://github.com/kpi-ua/ecampus.kpi.ua/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/kpi-ua/ecampus.kpi.ua.svg)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/pulls/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![GitHub watchers](https://img.shields.io/github/watchers/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Watch)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/watchers/)
[![GitHub forks](https://img.shields.io/github/forks/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Fork)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/network/)
[![GitHub stars](https://img.shields.io/github/stars/kpi-ua/ecampus.kpi.ua.svg?style=social&label=Star)](https://GitHub.com/kpi-ua/ecampus.kpi.ua/stargazers/)


# Electronic Campus of Igor Sikorsky Kyiv Polytechnic Institute

## Environment variables

* API_ENDPOINT - campus API location. Default value: `https://api.campus.kpi.ua/`
* OLD_UI_ADDRESS - location of 'classic' campus UI. Default value: `https://campus.kpi.ua/`
* LOGIN_PAGE_ADDRESS - location of login page. Used for redirect from external authorization providers. Default value: `https://ecampus.kpi.ua/login` 

## Build project
```
npm run build
```

## Run project
```
npm run start
```

## Docker
### Build container

```
docker build ./ --file ./Dockerfile --tag kpiua/ecampus-kpi-ua:latest
```

### Run
```
docker run --rm -it -p 80:80/tcp test:latest
```

```
docker run --rm -it -e API_ENDPOINT=https://api-v2.campus.kpi.ua/ -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```

```
docker run --rm -it \
  -e API_ENDPOINT=https://api.local/ \
  -e OLD_UI_ADDRESS=https://old-ui.local/  \
  -e LOGIN_PAGE_ADDRESS_LINE=https://ecampus.local/login \
  -p 80:80/tcp kpiua/ecampus-kpi-ua:latest
```
