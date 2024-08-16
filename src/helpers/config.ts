let _env: Record<string, string | undefined> = {};

export const config = () => ({
  apiUrl: _env.NEXT_PUBLIC_API_URL,
  paystackKey: _env.NEXT_PUBLIC_PAYSTACK_KEY,
  collectKey: _env.NEXT_PUBLIC_COLLECT_KEY,
  isDev: _env.NODE_ENV !== 'production',
  jwtSecretKey: _env.NEXT_PUBLIC_JWT_KEY || 'temp-key',
});

config.setEnv = (env: typeof _env) => (_env = env);
