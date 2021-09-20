import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'GET') {
        return res.status(403);
    }
    const isDev = process.env.VERCEL_ENV === 'development';

    res.json({ isDev });
}
