import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multerMiddleware.js';
import { 
    loginController, 
    logoutController, 
    registerController, 
    updatePasswordController, 
    updateProfilePicController, 
    updateUserProfileController, 
    userProfileController 
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerController)
router.post('/login', loginController);
router.get('/profile', isAuth, userProfileController);
router.get('/logout', isAuth, logoutController);
router.put('/profile-update', isAuth, updateUserProfileController);
router.put('/password-update', isAuth, updatePasswordController);
router.put('/update-pic', isAuth, singleUpload, updateProfilePicController);

export default router;