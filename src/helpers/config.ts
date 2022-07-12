export const config = () => ({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  collectKey: process.env.NEXT_PUBLIC_COLLECT_KEY,
  isDev: process.env.NODE_ENV !== 'production',
  jwtSecretKey: process.env.NEXT_PUBLIC_JWT_KEY,
});
