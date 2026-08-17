export const env = {
  // Dev'de Next.js rewrite proxy'si (next.config.mjs) kullanilir; ayni origin
  // oldugu icin CORS preflight gerekmez. Production'da NEXT_PUBLIC_API_BASE_URL
  // gercek backend URL'si olarak set edilmelidir.
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1.0",
  API_VERSION: "v1.0",
  ACCESS_TOKEN_KEY: "edc_access_token",
  REFRESH_TOKEN_KEY: "edc_refresh_token",
  AUTH_USER_KEY: "edc_current_user",
  TOKEN_EXPIRY_MINUTES: 15,
} as const;
