import express from 'express';
import files from './files/files';
import share from './share/share';

const router = express.Router();

router.use('/files', files);
router.use("/share", share)

export default router;