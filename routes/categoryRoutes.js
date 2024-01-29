import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories, 
    updateCategory 
} from '../controllers/categoryControllers.js';

const router = express.Router();

router.get('/all-cat', getAllCategories);
router.post('/create', isAuth, isAdmin, createCategory);
router.route('/:id').put(isAuth, isAdmin, updateCategory).delete(isAuth, isAdmin, deleteCategory);

export default router;