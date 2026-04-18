import { Router } from "express";
import {shorten,stats,redirect} from "../controllers/url.controller.js";
import rateLimiter from '../middleware/errorHandler.js'

const router = Router();

router.post('/shorten', rateLimiter, shorten);
router.get('/stats/:code', stats);
router.get('/:code', redirect);  // keep last — catch-all

export default router;