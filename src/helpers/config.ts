export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  isDev: process.env.NODE_ENV !== 'production',
  jwtKey: process.env.NEXT_PUBLIC_JWT_KEY,
  employeeUploadSample: process.env.NEXT_PUBLIC_EMPLOYEE_UPLOAD_SAMPLE,
};
