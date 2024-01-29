import express, { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { changeOrderStatus, createOrder, getAllOrders, getMyOrders, getMySingleOrder, paymentController } from '../controllers/orderControllers.js';

const router = express.Router();

router.post('/create', isAuth, createOrder)
router.get('/my-orders', isAuth, getMyOrders)
router.get('/my-orders/:id', isAuth, getMySingleOrder)
router.post('/payment', isAuth, paymentController)

// ********* ADMIN SECTION ********* //
router.get('/admin/all-orders', isAuth, isAdmin, getAllOrders)
router.put('/admin/update-order/:id', isAuth, isAdmin, changeOrderStatus)

export default router;