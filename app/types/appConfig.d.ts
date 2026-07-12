declare module "@nuxt/schema" {
  interface AppConfigInput {
    statusPage?: string;
    publisher: {
      name: string;
      url: string;
    };
  }
  interface AppConfig {
    statusPage?: string;
    publisher: {
      name: string;
      url: string;
    };
  }
}

export {};
