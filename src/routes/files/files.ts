import express from 'express';
import upload from './upload/upload';
import ls from './ls';
import download from './download';
import _delete from './delete';
import verifySession from '../../lib/verifySession';



const router = express.Router();
router.use(verifySession)
router.use('/upload', upload);
router.post("/ls", ls)
router.post("/download", download)
router.post("/delete", _delete)

export default router;