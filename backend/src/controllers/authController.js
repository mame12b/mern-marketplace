import User from "../models/User.js";  
import { registerService, loginService } from "../services/auth.service.js";    
import { ErrorResponse  } from "../middleware/error.middleware.js";
import Product from "../models/Product.js";


// Register a new user
// POST /api/auth/register
// Public
export const registerUser = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    return res.status(201).json(result); // <-- RETURN stops execution
  } catch (error) {
    next(error);
  }
};


// login user
// POST /api/auth/login
// Public
export const loginUser = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    return res.status(200).json(result); // <-- RETURN stops execution
  } catch (error) {
    next(error);
  }
};

// get current logged in user
// GET /api/auth/me
// Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        .populate('wishlist', 'title price images')
        .populate('cart.product', 'title price images');
        
        res.status(200).json({ 
            success: true,
            user 
        });
    } catch (error) {
        next(error);
    }
};

// logout user / clear cookie
// GET /api/auth/logout
// Private
export const logoutUser = async (req, res, next) => {
    try {
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({ 
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};

// verify email
// GET /api/auth/verify-email?token=
// Public
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
        });

        if (!user) {
            return next(new ErrorResponse("Invalid or expired token", 400));
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

// forgot password
// POST /api/auth/forgot-password
// Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorResponse("There is no user with that email", 404));
        }

        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.resetPasswordToken = resetToken;
        // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();


        // TODO: send reset  password email
        // await sendResetPasswordEmail(user.email, resetToken);
        res.status(200).json({
            success: true,
            message: "Password reset token generated and sent to email",
        });
    } catch (error) {
        next(error);
    }
};

// reset password
// POST /api/auth/reset-password/:token
// Public
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            // resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid or expired token", 400));
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        // user.resetPasswordExpires = undefined;
        await user.save();


        sendTokenResponse(user, 200, res, "Password reset successful");
    } catch (error) {
        next(error);
    }
};
//  helper function to send token response
const sendTokenResponse = (user, statusCode, res, message) => {
    // Create token
    const token = user.generateJWT();
    const refreshToken = user.generateRefreshToken();

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days    
    };
    //  Remove password from output
    user.password = undefined;

    res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
        success: true,
        message,
        token,
        user,
    });
};  