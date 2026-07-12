declare module "@nuxt/schema" {
  interface AppConfigInput {
    statusPage?: string;
    publisher: {
      name: string;
      url: string;
      contact?: string;
    };
    scalar: {
      enabled: boolean;
    };
  }
  interface AppConfig {
    statusPage?: string;
    publisher: {
      name: string;
      url: string;
      contact?: string;
    };
    scalar: {
      enabled: boolean;
    };
  }
}

export {};
