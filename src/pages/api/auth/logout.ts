import routes from '@/lib/routes';
import { NextApiRequest, NextApiResponse } from 'next';
import { signOut } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    // if (method !== 'POST') {
    //     return res.status(405).json({ message: 'Method Not Allowed' });
    // }

    await signOut();
    res.redirect("/");
}
