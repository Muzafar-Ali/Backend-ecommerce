import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email is already registered']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'password must be at least 6 characters long']
  },
  address: {
    type: String,
    required: [true, 'address is required']
  },
  city: {
    type: String,
    required: [true, 'city is required']
  },
  country: {
    type: String,
    required: [true, 'country is required']
  },
  phone: {
    type: String,
    required: [true, 'phone is required']
  },
  profilePic: {
      public_id: {
          type: String,
      },
      url: {
          type: String,
      }
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // isBlocked: {
  //   type: Boolean,
  //   default: false,
  // },
  role: {
    type: String,
    default: "user"
  },
  resetToken: {
    type: String,
    default: ""
  },
  resetTokenExpires: {
    type: Date,
  }
  
    
},{timestamps:true});

//encrypt the password before saving
userSchema.pre('save', async function (next) {
  try {
    // Hash the password only if it's modified or a new user
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Set the hashed password back to the user object
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

//decrypt the password 
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
      return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
      throw new Error(`Error comparing passwords: ${error.message}`);
  }
}

//create jwt token
userSchema.methods.generateAuthToken = async function () {
  try {
      const token = JWT.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
      return token;
  } catch (error) {
      throw new Error(`Error generating token: ${error.message}`);
  }
}

export const User = mongoose.model("Users", userSchema);
// module.exports = mongoose.model("User", userSchema);
