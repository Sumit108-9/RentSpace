import express from 'express';
import { googleSignIn } from '../controllers/googleAuth.controller.js';

const router = express.Router();

// Google Sign In
router.post('/google', googleSignIn);

export default router;
