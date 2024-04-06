import express from 'express';
import init from './init/handler';
import status from './status';

const router = express.Router();

router.post("/init", async (req, res) => res.json(await init(req, res)))
router.post("/status", status)

export default router;