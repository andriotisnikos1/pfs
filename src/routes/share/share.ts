import express from 'express';
import init from './init';
import download from './download';
import { share } from '../../lib/types/interfaces/share';
import { dtb } from '../../central.config';
import list from './list';
import expire from './expire';
import verifySession from '../../lib/verifySession';

const shares = dtb.collection<share>("share")

const share = express.Router();

share.post("/init", init)
share.get("/download/:shareID", download)
share.get("/list", list)
share.post("/expire", expire)

share.use(async (req, res, next) => {
    //delete expired shares
    await shares.deleteMany({ expires: { $lt: Date.now() } })
    next()
})

share.use(verifySession)

export default share;