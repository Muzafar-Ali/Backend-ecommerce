import JWT from 'jsonwebtoken';
import { User } from '../models/userModel.js';

//USER AUTHENTICATION MIDDLEWARE
export const isAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token)
        return res.status(401).json({ 
            success: false,
            message:"authorization denied." 
        });

        const decodeUserId = JWT.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodeUserId._id);
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//ADMIN AUTHENTICATION MIDDLEWARE
export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Admin only."
            });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
