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

router.get('/all-products', getAllProducts)
router.get('/:id', getSingleProduct)
router.post('/create', isAuth, singleUpload, createProduct)
router.put('/:id', isAuth, updateProduct)
router.put('/image/:id', isAuth, singleUpload, updateProductImage)
router.put('/image/:id', isAuth, singleUpload, updateProductImage)
router.delete('/image-delete/:id', isAuth, deleteProductImage)
router.delete('/:id', isAuth, deleteProduct)


export default router;