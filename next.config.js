/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['cdn.britannica.com'],
  },
  // Stale duplicates of the marketing pages. The page files still exist and are
  // still linked from the old app layout, but these are the canonical URLs and
  // the only ones the marketing footer points at. Next checks redirects before
  // filesystem routes, so these win over the legacy pages. (plan Q-4)
  async redirects() {
    return [
      { source: '/about-us', destination: '/about', permanent: true },
      // The PAYE feature page was renamed when the statutory acronyms came off
      // the marketing copy. Keep the old URL working for any inbound link.
      {
        source: '/features/paye',
        destination: '/features/income-tax',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/legal/privacy',
        permanent: true,
      },
      {
        source: '/terms&conditions',
        destination: '/legal/terms',
        permanent: true,
      },
    ];
  },
  // publicRuntimeConfig: {
  //   apiUrl: process.env.NEXT_PUBLIC_API_URL,
  //   paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  //   isDev: process.env.NODE_ENV !== 'production',
  //   employeeUploadSample: process.env.NEXT_PUBLIC_EMPLOYEE_UPLOAD_SAMPLE,

  // },
};
