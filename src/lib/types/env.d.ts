declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: 'development' | 'production';
        PORT?: string;
        CF_ACCOUNT_ID: string;
        CF_BUCKET_NAME: string;
        CF_AUTH_KEY_ID: string;
        CF_AUTH_KEY_SECRET: string;
    }
}