import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories, 
    updateCategory 
} from '../controllers/categoryControllers.js';

const router = express.Router();

router.get('/all-cat', getAllCategories)
router.post('/create', createCategory)
router.put('/:id', isAuth, updateCategory)
router.delete('/:id',isAuth ,deleteCategory)

export default router;