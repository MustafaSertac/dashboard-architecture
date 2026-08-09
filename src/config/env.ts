export const env = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5295/api/v1.0",
  API_VERSION: "v1.0",
  ACCESS_TOKEN_KEY: "edc_access_token",
  REFRESH_TOKEN_KEY: "edc_refresh_token",
  AUTH_USER_KEY: "edc_current_user",
  TOKEN_EXPIRY_MINUTES: 15,
} as const;
