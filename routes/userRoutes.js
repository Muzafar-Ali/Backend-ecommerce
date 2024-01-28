import express from 'express';
const router = express.Router();
import { loginController, logoutController, registerController, updateUserProfileController, userProfileController } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/authMiddlewares.js';

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/profile', isAuth, userProfileController);
router.get('/logout', isAuth, logoutController);
router.put('/profile-update', isAuth, updateUserProfileController);

export default router;