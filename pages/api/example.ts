import type { NextApiRequest, NextApiResponse } from "next";

import MockBuilder from "@src/MockBuilder";

export default (req: NextApiRequest, res: NextApiResponse) =>
  MockBuilder.define(req, res);
