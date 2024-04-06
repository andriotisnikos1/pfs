import express from 'express';
import upload from './upload/upload';
import ls from './ls';
import download from './download';
import _delete from './delete';

const router = express.Router();

router.post('/upload', upload);
router.post("/ls", ls)
router.post("/download", download)
router.post("/delete", _delete)

export default router;