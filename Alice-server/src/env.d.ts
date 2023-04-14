declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    TRANSLOADIT_AUTH_KEY: string;
    TRANSLOADIT_AUTH_SECRET: string;
  }
}
