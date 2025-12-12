import User from "../models/User.js";
import Product from "../models/Product.js";
import { ErrorResponse } from  "../middleware/errorMiddleware.js";
import { use } from "react";


// update user profile
// PUT /api/users/profile
// Private
export const updateProfile  = async (req, res, next) => {
    try {
        const {firstName, lastName, phone, shopName, shopDescription} = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }
        //  Update user profile fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if(phone) user.phone = phone;

        //seller spefic fields
        if(user.role === 'seller') {
            if (shopName) user.shopName = shopName;
            if (shopDescription) user.shopDescription = shopDescription;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// add address
// POST /api/users/addresses
// Private
export const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.addresses.length ===0 || req.body.isDefault) {
            // remove default from other addresses
            user.addresses.forEach(addr => addr.isDefault = false);
            req.body.isDefault = true;
        }
        user.addresses.push(req.body);;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// update address
// PUT /api/users/addresses/:index
// Private
export const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.index);

        if (!address) {
            return next(new ErrorResponse("Address not found", 404));
        }

        if (req.body.isDefault) {
            // remove default from other addresses
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// delete address
// DELETE /api/users/addresses/:addressId
// Private
export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// add to wishlist
// POST /api/users/wishlist/:productId
// Private
export const addToWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }
        
        if (user.wishlist.includes(req.params.productId)) {
            return next(new ErrorResponse("Product already in wishlist", 400));
        }
        user.wishlist.push(req.params.productId);
        await user.save();

        await user.populate('wishlist', 'title price images');

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};  

// remove from wishlist
// DELETE /api/users/wishlist/:productId
// Private
export const removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            id => id.toString() !== req.params.productId
        );

        await user.save();

        await user.populate('wishlist', 'title price images');

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: user.wishlist
        });
    } catch (error) {
        next(error);
    }
};
// get wishlist
// GET /api/users/wishlist
// Private
export const getWishlist = async (req, res, next) => {
    try {
        const { productId, quantity = 1} = req.body;

        const user = await User.findById(req.user.id);
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }

        if (product.status !== 'available') {  
            return next(new ErrorResponse("Product is not available", 400));
        }

        if (product.stock < quantity) {
            return next(new ErrorResponse("Insufficient stock for the requested quantity", 400));
        }
        // check if product already in cart
        const existingItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            // update quantity
            existingItem.quantity += quantity;
            if (existingItem.quantity > product.stock) {
                return next(new ErrorResponse("Insufficient stock for the requested quantity", 400));
            }
        } else {
            // add new item to cart
            user.cart.push({ 
                product: productId, 
                quantity 
            });
        }
        await user.save();

        await user.populate({'cart.product': 'title price images stock'});

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: user.cart
        });
    } catch (error) {
        next(error);
    }
};
// update cart item
// PUT /api/users/cart/:productId
// Private
export const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.user.id);

        const cartItem = user.cart.find(
            item => item.product.toString() === req.params.productId
        );

        if (!cartItem) {
            return next(new ErrorResponse("Product not in cart", 404));
        }

        const product = await Product.findById(req.params.productId);

        if(quantity > product.stock) {
            return next(new ErrorResponse("Insufficient stock for the requested quantity", 400));
        }

        cartItem.quantity = quantity;
        await user.save();

        await user.populate({'cart.product': 'title price images stock'});

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: user.cart
        });
    } catch (error) {
        next(error);
    }
};

// remove from cart
// DELETE /api/users/cart/:productId
// Private
export const removeFromCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.cart = user.cart.filter(
            item => item.product.toString() !== req.params.productId
        );

        await user.save();

        await user.populate({'cart.product': 'title price images stock'});

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: user.cart
        });
    } catch (error) {
        next(error);
    }
};

// get cart
// GET /api/users/cart
// Private
export const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        .populate({'cart.product': 'title price images stock'});

        // calculate total price
        let subtotal = 0;
        const validItems = user.cart.filter(item => {
            if (item.product && item.product.status === ' available') {
                subtotal += item.product.price * item.quantity;
                return true;
            }
            return false;
        }); 
        res.status(200).json({
            success: true,
            data: {
                cartItems: validItems,
                subtotal,
                itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0)

            }
        });

    } catch (error) {
        next(error); 
    }
};

// clear cart
// DELETE /api/users/cart
// Private
export const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.cart = [];

        await user.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    } catch (error) {
        next(error);
    }
};

//  change password
// PUT /api/users/change-password
// Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id).select('+password');

        // check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return next(new ErrorResponse("Current password is incorrect", 400));
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        next(error);
    }
};
