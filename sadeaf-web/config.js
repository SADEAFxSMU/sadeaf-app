module.exports = {
  PRODUCTION: process.env.NODE_ENV === "production",
  AWS: {
    REGION: process.env.AWS_REGION || 'us-east-1',
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
  SMTP: {
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
    HOST: process.env.SMTP_HOST || 'localhost',
    PORT: process.env.SMTP_PORT || 11025,
    TLS: process.env.SMTP_TLS === 'true'
  },
  MAILHOG: {
    ENDPOINT: process.env.MAILHOG_ENDPOINT || "http://localhost:18025"
  },
  POSTGRES: {
    QUEUE_DATABASE_URL: process.env.POSTGRES_QUEUE_DATABASE_URL || 'postgres://postgres:postgrespassword@localhost:5432/sadeaf_app'
  }
}
