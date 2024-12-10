class ApplicationConfiguration {
  constructor() {
    const json = this.loadTextFileAjaxSync('/config.json');
    this.configuratiun = JSON.parse(json);

    console.log(this.configuratiun);
  }

  get ApiEndpoint() {
    return this.configuratiun.ApiEndpoint;
  }

  get KpiIdRedirectAddress() {
    return `https://auth.kpi.ua?appId=${this.configuratiun.AppId}`;
  }

  get OldUIAddress() {
    return this.configuratiun.OldUIAddress;
  }

  get LoginPageAddress() {
    return this.configuratiun.LoginPageAddress;
  }

  loadTextFileAjaxSync(filePath) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath, false);

    xmlhttp.send();

    if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
      return xmlhttp.responseText;
    } else {
      // TODO Throw exception
      return null;
    }
  }
}


export default new ApplicationConfiguration();
