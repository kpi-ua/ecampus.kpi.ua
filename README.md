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
