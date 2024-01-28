import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
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

router.route('/:id').get(getSingleProduct).put(isAuth, updateProduct).delete(isAuth, deleteProduct)
router.route('/image/:id').put(isAuth, singleUpload, updateProductImage).delete(isAuth, deleteProductImage)
router.get('/all-products', getAllProducts)
router.post('/create', isAuth, singleUpload, createProduct)


export default router;