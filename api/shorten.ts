import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface ICuttlyUrlData {
    status: number;
    fullLink: string;
    date: string;
    shortLink: string;
    title: string;
}

type ICuttlyData = Record<'url', ICuttlyUrlData>;

export default async (req: VercelRequest, res: VercelResponse) => {

    if (req.method !== 'POST') {
        res
            .status(404)
            .send(null);

        return;
    }

    const { url } = req.body ?? {};

    if (!url) {
        res
            .status(422)
            .send(null);

        return;
    }

    const apiKey = process.env.CUTTLY_KEY;

    const cuttlyResponse = await axios.get<ICuttlyData>('https://cutt.ly/api/api.php', {
        params: {
            key: apiKey,
            short: url,
        },
        responseType: 'json',
    });

    const shortenedUrl = cuttlyResponse.data.url.shortLink;

    res
        .status(200)
        .json({ url: shortenedUrl })
}
