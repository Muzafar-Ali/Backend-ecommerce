import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multerMiddleware.js';
import { 
    createProduct,
    deleteProduct,
    deleteProductImage,
    getAllProducts, 
    getSingleProduct, 
    updateProduct,
    updateProductImage
} from '../controllers/productControllers.js';

const router = express.Router();

router.get('/all-products', getAllProducts)
router.route('/:id').get(getSingleProduct).put(isAuth, isAdmin, updateProduct).delete(isAuth, isAdmin, deleteProduct)
router.route('/image/:id').put(isAuth, isAdmin, singleUpload, updateProductImage).delete(isAuth, isAdmin, deleteProductImage)
router.post('/create', isAuth, isAdmin, singleUpload, createProduct)


export default router;