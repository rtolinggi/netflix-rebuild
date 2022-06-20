export const constant = {
  NODE_ENV: process.env.NODE_ENV as string,
  EMAIL_VERIFICATION: process.env.EMAIL_VERIFICATION === "true" ? true : false,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT as string),
  EMAIL_SECURE: process.env.SECURE === "true" ? true : false,
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  EMAIL_SERVICE: process.env.EMAIL_SERVICES as string,
};
