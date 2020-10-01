module.exports = {
  PRODUCTION: process.env.NODE_ENV === "production",
  LOCALSTACK: {
    AWS: {
      REGION: 'us-east-1',
      ACCESS_KEY_ID: "accessKeyId",
      SECRET_ACCESS_KEY: "secretAccessKey",
    },
  },
  AWS: {
    S3: {
      INVOICE: {
        BUCKET: {
          REGION: process.env.AWS_S3_INVOICE_BUCKET_REGION || "",
          NAME: process.env.AWS_S3_INVOICE_BUCKET_NAME || "",
        },
      },
    },
    COGNITO: {
      REGION: process.env.AWS_COGNITO_REGION || "ap-southeast-1",
      USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
      USER_POOL_WEB_CLIENT_ID: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID || "1m91mgkmmhi4bqchc5uecbg7t4",
    },
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
  },
  HASURA: {
    GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'sadeaf-hasura-console',
    GRAPHQL_ENDPOINT: process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080',
    GRAPHQL_API_URL: process.env.HASURA_GRAPHQL_API_URL
      || (process.env.HASURA_GRAPHQL_ENDPOINT && `${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`)
      || 'http://localhost:8080/v1/graphql',
  }
}
