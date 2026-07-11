declare module "@nuxt/schema" {
  interface RuntimeConfig {
    turnstile: {
      secretKey: string;
    };
  }
}

export {};
