class ApplicationConfiguration {
  constructor() {
    this.config = null;
  }

  async loadConfig() {
    if (!this.config) {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.config = await response.json();
        console.log(this.config);  // Just for debugging
      } catch (error) {
        console.error("Failed to load configuration:", error);
        this.config = {};  // Set default or empty config in case of error
      }
    }
  }

  async getApiEndpoint() {
    await this.loadConfig();
    return this.config?.ApiEndpoint || '';
  }

  async getOldUIAddress() {
    await this.loadConfig();
    return this.config?.OldUIAddress || '';
  }

  async getLoginPageAddress() {
    await this.loadConfig();
    return this.config?.LoginPageAddress || '';
  }
}

export default new ApplicationConfiguration();
