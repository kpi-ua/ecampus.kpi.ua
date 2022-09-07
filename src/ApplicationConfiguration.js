class ApplicationConfiguration {
    constructor() {
        this.configuratiun = require('./config.json');
    }

    get ApiEndpoint() {
        return this.configuratiun.ApiEndpoint;
    }

    get OldUIAddress() {
        return this.configuratiun.OldUIAddress;
    }

    get LoginPageAddress() {
        return this.configuratiun.LoginPageAddress;
    }
}

export default new ApplicationConfiguration();
