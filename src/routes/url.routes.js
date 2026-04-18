import { Router } from "express";
import urlController from "../controllers/url.controller";
import rateLimiter from '../middleware/errorHandler'

router.post('/shorten', rateLimiter, urlController.shorten);
router.get('/stats/:code', urlController.stats);
router.get('/:code', urlController.redirect);  // keep last — catch-all

export default router;