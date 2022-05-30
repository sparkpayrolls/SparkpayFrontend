/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // publicRuntimeConfig: {
  //   apiUrl: process.env.NEXT_PUBLIC_API_URL,
  //   paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  //   isDev: process.env.NODE_ENV !== 'production',
  //   employeeUploadSample: process.env.NEXT_PUBLIC_EMPLOYEE_UPLOAD_SAMPLE,

  // },
};
