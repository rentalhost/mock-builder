import fs from 'fs';

import { NextApiRequest, NextApiResponse } from 'next';
import { ZodSchema } from 'zod';

import FileSystem from '@src/FileSystem';

interface DefineOptionsInterface
{
    format?: ZodSchema;

    defaultValue?: unknown;
}

export default class MockBuilder
{
    private static processGet(
        path: string,
        response: NextApiResponse,
        options?: DefineOptionsInterface
    )
    {
        if (!fs.existsSync(path)) {
            if (options?.defaultValue) {
                return response.status(200).json(options.defaultValue);
            }

            return response.status(404).json({ error: 'file not found' });
        }

        return response.status(200).send(fs.readFileSync(path).toString());
    }

    private static processPost(
        path: string,
        request: NextApiRequest,
        response: NextApiResponse,
        options?: DefineOptionsInterface
    )
    {
        let requestBody = request.body;

        if (options?.format) {
            const parse = options.format.safeParse(requestBody);

            if (!parse.success) {
                return response.status(400).json({
                    error:  'the data sent has an invalid format',
                    issues: parse.error.issues
                });
            }

            requestBody = parse.data;
        }

        FileSystem.writeSync(path, JSON.stringify(requestBody));

        return response.status(200).send(requestBody);
    }

    static define(
        request: NextApiRequest,
        response: NextApiResponse,
        options?: DefineOptionsInterface
    )
    {
        const path = `./storage/${ request.url?.slice(5) }.json`;

        if (request.method === 'GET') {
            return this.processGet(path, response, options);
        }

        if (request.method === 'POST') {
            return this.processPost(path, request, response, options);
        }

        return response.status(501).json({ error: 'not implemented' });
    }
}
