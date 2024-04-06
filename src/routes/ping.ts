import { Request, Response } from 'express';
import { version } from '../central.config';

export default (req: Request, res: Response) => res.json({
    status: "success",
    type: "PFS Host - Personal File System",
    version: version,
    authPermitted: process.env.AUTH_PERMITTED === "true",
})