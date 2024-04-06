import express from 'express';
import files from './files/files';
import share from './share/share';
import ping from './ping';

const router = express.Router();

router.use('/files', files);
router.use("/share", share)
router.get("/ping", ping)

export default router;