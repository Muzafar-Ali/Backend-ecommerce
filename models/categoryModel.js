import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name is required']
    },
},{timestamps: true})

const category = mongoose.model('Category', categorySchema);   

export default category;