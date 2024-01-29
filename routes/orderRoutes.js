import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { createOrder, getMyOrders, getMySingleOrder } from '../controllers/orderControllers.js';

const router = express.Router();

router.post('/create', isAuth, createOrder)
router.get('/my-orders', isAuth, getMyOrders)
router.get('/my-orders/:id', isAuth, getMySingleOrder)

export default router;