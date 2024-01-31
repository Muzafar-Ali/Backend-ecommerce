import Product  from "../models/productModel.js";
import  Category  from "../models/categoryModel.js";
import getDataUri from "../utils/features.js";
import cloudinary from "cloudinary";


// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:`Erro in getting all products: ${error.message}`,
        })
    }
}

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        
        res.status(200).json({
            success: true,
            product
        });

        
    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            });
        }

        return res.status(500).json({
            success: false,
            message:`Error in getting single product: ${error.message}`,
            error
        })
    }
}

// CREATE A PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        if(!name || !price || !description || !category || !stock){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details",
            });
        }

        // Fetch the category ObjectId based on the provided category name
        const categoryObject = await Category.findOne({ name: category });

        if (!categoryObject) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }
        

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please provide product images",
            });
        }

        const file = getDataUri(req.file);
        const cloudinaryDataBase = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cloudinaryDataBase.public_id,
            url: cloudinaryDataBase.secure_url
        }

        await Product.create({
            name, 
            price, 
            description, 
            category: categoryObject._id, 
            stock, 
            images: [image]
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
        })
        
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:`Error in creating product: ${error.message}`,
        })
    }
}

//UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const { name, price, description, category, stock } = req.body;
        if(name) product.name = name;
        if(price) product.price = price;
        if(description) product.description = description;
        if(category) product.category = category;
        if(stock) product.stock = stock;

        //save product
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        })

    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            });
        }
        return res.status(500).json({
            success: false,
            message:`Error in updating product: ${error.message}`,
        })
    }
}

//UPDATE PRODUCT IMAGE
export const updateProductImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please provide product images",
            });
        }

        const file = getDataUri(req.file);
        const cloudinaryDataBase = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cloudinaryDataBase.public_id,
            url: cloudinaryDataBase.secure_url
        }

        product.images.push(image);
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product image updated successfully",
        })

    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            })
        }
        
        return res.status(500).json({
            success: false,
            message:`Error in updating product image: ${error.message}`,
        })
    }
}

//DELTE PRODUCT IMAGE
export const deleteProductImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const imageId = req.query.id;
        if(!imageId){
            return res.status(400).json({
                success: false,
                message: "Please provide image id",
            });
        }

        const imageIndex = product.images.findIndex((image) => image._id === imageId);
        if(imageIndex === -1){
            return res.status(404).json({
                success: false,
                message: "Image not found",
            });
        }

        await cloudinary.v2.uploader.destroy(product.images[imageIndex].public_id);
        product.images.splice(imageIndex, 1);   
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product image deleted successfully",
        })
        
    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            })
        }

        return res.status(500).json({
            success: false,
            message:`Error in deleting product image: ${error.message}`,
        })
    }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // delelet all images from cloudinary
        for (const image of product.images) {
            // Destroy each image in sequence
            await cloudinary.v2.uploader.destroy(image.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            });
        }

        return res.status(500).json({
            success: false,
            message: `Error in deleting product: ${error.message}`,
        });
    }
};


//PRODUCT REVIEW AND COMMENT 

export const productReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        
        //if already reviewed
        const isReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
        if(isReviewed){
            return res.status(400).json({
                success: false,
                message: "Product already reviewed",
            })
        }

        // if (isReviewed) {
        //     product.reviews.forEach((review) => {
        //         if (review.user.toString() === req.user._id.toString()) {
        //             review.rating = rating;
        //             review.comment = comment;
        //         }
        //     });
        // }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({
            success: true,
            message: "Review added successfully",
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Invalid product id",
            });
        }
        return res.status(500).json({
            success: false,
            message: `Error in adding review: ${error.message}`,
        });
    }
}