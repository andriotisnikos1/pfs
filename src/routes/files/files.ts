import express from 'express';
import upload from './upload/upload';
import ls from './ls';
import download from './download';

const router = express.Router();

router.use('/upload', upload);
router.use("/ls", ls)
router.use("/download", download)

export default router;