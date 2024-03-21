import express from 'express';
import files from './files/files';

const router = express.Router();

router.use('/files', files);

export default router;