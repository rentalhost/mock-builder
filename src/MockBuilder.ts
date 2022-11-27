import fs from 'fs';

import { NextApiRequest, NextApiResponse } from 'next';

export default class MockBuilder
{
    private static processGet(path: string, response: NextApiResponse)
    {
        if (!fs.existsSync(path)) {
            return response.status(404).json({ error: 'file not found' });
        }

        return response.status(200).send(fs.readFileSync(path).toString());
    }

    private static processPost(path: string, request: NextApiRequest, response: NextApiResponse)
    {
        fs.writeFileSync(path, JSON.stringify(request.body));

        return response.status(200).send(request.body);
    }

    static define(
        request: NextApiRequest,
        response: NextApiResponse
    )
    {
        const path = `./storage/${ request.url?.slice(5) }.json`;

        if (request.method === 'GET') {
            return this.processGet(path, response);
        }

        if (request.method === 'POST') {
            return this.processPost(path, request, response);
        }

        return response.status(400).json({ error: 'not implemented' });
    }
}
