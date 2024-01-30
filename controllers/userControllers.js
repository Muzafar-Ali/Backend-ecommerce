//create user controllers registerUser, loginUser, getMe
import { User } from "../models/userModel.js";
import getDataUri from "../utils/features.js";
import cloudinary from "cloudinary";
import JWT from "jsonwebtoken";

// REGISTER CONTROLLER
export const registerController = async (req,res) => {
    try {

        const { name, email, password, address, city, country, phone, profilePic } = req.body;

        if (!name || !email || !password || !address || !city || !country || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the Fields",
            })
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            address, 
            city, 
            country, 
            phone, 
            profilePic
          });

          if (user) {
            return res.status(201).json({
                success: true,
                message: "User created successfully",
            })
          } else {
            return res.status(400).json({
                success: false,
                message: "Failed to create user",
                err
            })
        }

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in register API: ${error.message}`
        })
    }
}

//LOGIN CONTROLLER
export const loginController = async (req,res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the Fields",
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            })
        }
        
        const token = await user.generateAuthToken();

        return res
        .status(200).cookie("token", token, {
            expires: new Date(Date.now() +  24 * 60 * 60 * 1000)
        })
        .json({
            success: true,
            message: "Login Successful",
            token,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in login API: ${error.message}`
        })
    }
}

//USER FPROFILE CONTROLLER
export const userProfileController = async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        
        return res.status(200).json({
            success: true,
            user
            
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in user profile API: ${error.message}`
        })
    }
}

//USER LOGOUT CONTROLLER
export const logoutController = async (req,res) => {
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now())
        }).json({
            success: true,
            message: "Logout Successful"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in logout API: ${error.message}`
        })
    }
}
// UPDATE USER PROFILE
export const updateUserProfileController = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { name, email, address, city, country, phone } = req.body;
      console.log(req.body);

    //   if(req.file) user.profilePic = req.file.filename;
      
      if(name) user.name = name;
      if(email) user.email = email;
      if(address) user.address = address;
      if(city) user.city = city;
      if(country) user.country = country;
      if(phone) user.phone = phone;
  
      const updatedUser = await user.save();
  
      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user: updatedUser,
      })
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in update user profile API: ${error.message}`,
      });
    }
}

// UPDATE PASSWORD 
export const updatePasswordController = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('+password');
  
      if (!user) {
        return res.status(404).json({ 
            success: false,
            message: 'User not found' 
        });
      }
  
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ 
            success: false,
            message: 'Please enter old and new passwords' 
        });
      }
  
      const isMatch = await user.comparePassword(oldPassword);
  
      if (!isMatch) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid old password' 
        });
      }
    // save new password
      user.password = newPassword;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error in update password API: ${error.message}`,
      });
    }
}

// UPDATE PROFILE PIC 
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const file = getDataUri(req.file);
        //delete previous profile pic
        if(user.profilePic.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }
        const cloudinaryDataBase = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic = {
            public_id: cloudinaryDataBase.public_id,
            url: cloudinaryDataBase.secure_url
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile pic updated successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in update profile pic API: ${error.message}`
        })
    }
} 

// //FORGOT PASSWORD with sendgrid
// export const forgotPasswordController = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if(!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             })
//         }

//         // Generate and save reset token
//         const resetToken = generateResetToken(user._id);
//         user.resetToken = resetToken;
//         user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
//         await user.save();

//         // Send reset password email
//         await sendResetEmail(user.email, resetToken);
        
//         res.status(200).json({
//             success: true,
//             message: 'Reset email sent successfully'
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: `Error in forgot password API: ${error.message}`
//         })
//     }
// }

// //RESET PASSWORD with sendgrid
// export const resetPasswordController = async (req, res) => {
//     try {
//         const { token, newPassword } = req.body;
//         // Verify and decode the token
//         const salt = await bcrypt.genSalt(10);
//         const decodedToken = JWT.verify(token, salt);
//         // Find user by decoded user ID
//         const user = await User.findById(decodedToken.userId);
//         // const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

//         if (!user || user.resetToken !== token || user.resetTokenExpires < Date.now()) {
//             return res.status(400).json({ 
//                 success: false,
//                 message: 'Invalid or expired token' });
//         }

//         // Update user password
//         user.password = newPassword;
//         user.resetToken = undefined;
//         user.resetTokenExpires = undefined;
//         await user.save();


//         res.status(200).json({
//             success: true,
//             message: 'Password reset successfully'
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: `Error in reset password API: ${error.message}`
//         })
//     }
// }