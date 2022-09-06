# Electronic Campus of Igor Sikorsky Kyiv Polytechnic Institute


## Environment variables

* API_ENDPOINT - campus API location. Default value is `https://api.campus.kpi.ua/`
* OLD_UI_ADDRESS - location of 'classic' campus UI. Default value is `https://campus.kpi.ua/`
* LOGIN_PAGE_ADDRESS - location of login page. Used for redirect from external authorization providers. Default value is `https://ecampus.kpi.ua/login` 

# Build project
`npm run build`

## Docker
### Build container

`docker build ./ --file ./.dockerfile --tag test:latest`

### Run
`docker run --rm -it  -p 80:80/tcp test:latest`

`docker run --rm -it -e API_ENDPOINT=https://xxx.campus.kpi.ua/ -p 80:80/tcp test:latest`
