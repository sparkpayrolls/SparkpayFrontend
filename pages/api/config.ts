import { NextApiHandler } from 'next';

const handler: NextApiHandler = (_req, res) => {
  const env: Record<string, string | undefined> = {};

  Object.entries(process.env).forEach(([key, value]) => {
    if (key.includes('NEXT_PUBLIC')) {
      env[key] = value;
    }
  });

  res.json(env);
};

export default handler;
