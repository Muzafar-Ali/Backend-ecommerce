import Category from '../models/categoryModel.js';
import Product  from '../models/productModel.js';

//GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            total_categories: categories.length,
            categories
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: `Error in get all categories API ${error.message}`
        });
    }
}

//CREATE CATEGORY
export const createCategory = async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Please enter category",
            });
        }

        const categoryExist = await Category.findOne({ category });
        if (categoryExist) {
            return res.status(400).json({
                success: false,
                message: `${category} Category already exists`,
            });
        }
        
        await Category.create({
            name: category
        });
        res.status(201).json({
            success: true,
            message: `${category} Category created successfully`,
        });

    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: `Error in create category API ${error.message}`
        });
    }
}

//UPDATE CATEGORY
export const updateCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: `Category does not exists`,
            });
        }
        
        const { updatedCategory } = req.body;
        if(updatedCategory) category.name = updatedCategory;
        await category.save();
        res.status(201).json({
            success: true,
            message: `Category updated successfully`,
        });

        //update the category of all the products which are associated with this category
        const products = await Product.find({ category: category._id })
        for (const product of products) {
            product.category = updatedCategory;
            await product.save();
        }

    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid category id",
            });
        }
        res.status(400).json({ 
            success: false,
            message: `Error in update category API ${error.message}`
        });
    }
}

//DELETE CATEGORY
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        //get the products which are associated with this category and remove category from them
        const products = await Product.find({ category: category._id })
        for (const product of products) {
            product.category = undefined;
            await product.save();
        }
        
        await category.deleteOne();
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                success: false,
                message: "Invalid category id",
            });
        }
        res.status(400).json({ 
            success: false,
            message: `Error in delete category API ${error.message}`
        });
    }
}

