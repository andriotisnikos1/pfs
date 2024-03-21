const requiredEnv = [
    "CF_ACCOUNT_ID",
    "CF_BUCKET_NAME",
    "CF_AUTH_KEY_ID",
    "CF_AUTH_KEY_SECRET",
    "AUTH_USERNAME",
    "AUTH_PASSWORD"
]

export default function checkRequiredEnv() {
    for (const env of requiredEnv) {
        if (!process.env[env]) {
            throw new Error(`Missing required environment variable: ${env}`);
        }
    }
}