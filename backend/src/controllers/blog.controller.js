import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Blog from "../model/blog.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
    const {title,description,image,user} = req.body;
    if(!title || !description || !image|| !user){
        throw new ApiError(400,"Please provide all the details")
    }

    const existingUser = await User.findById(user)
    if(!existingUser){
        throw new ApiError(400,"User not found")
    }


    const blog = await Blog.create({title,description,image,user})
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({session})
    existingUser.blogs.push(blog)
    await existingUser.save({session})
    await session.commitTransaction();
    session.endSession();

    if(!blog){
        throw new ApiError(400,"Blog not created")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {blog:blog},
            "Blog created successfully"
        )
    )
})

const getAllBlog = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({}).populate('user');
    if(!blogs){
        throw new ApiError(404,"No blogs found")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {blogs:blogs,blogCount:blogs.length},
            "All blogs received"
        )
    )
})

const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {title,description,image} = req.body;

    //  if(!title || !description || !image){
    //    throw new ApiError(400,"Please provide all the details")
    //   }

    const blog = await Blog.findByIdAndUpdate(id,{...req.body},{new:true})
    
    if(!blog){
        throw new ApiError(400,"Blog not updated")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {blog:blog},
            "Blog updated successfully"
        )
    )
})

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const blog = await Blog.findByIdAndDelete(id).populate("user")
    //await User.findByIdAndUpdate(blog.user._id,{$pull:{blogs:blog._id}})
    await blog.user.blogs.pull(blog._id)
    await blog.user.save()
    res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Blog deleted successfully"
        )
    )
})

const getBlogById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const blog = await Blog.findById(id)
    if(!blog){
        throw new ApiError(404,"No blog found")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {blog:blog},
            "Blog received"
        )
    )
})

const getUserBlog = asyncHandler(async (req, res) => {                   // remove password
    const {id} = req.params;

    const userBlogs = await User.findById(id).populate("blogs")
    if(!userBlogs){
        throw new ApiError(404,"No blog found for this user")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {userBlogs:userBlogs},
            "Blogs received"
        )
    )

})

export{
    createBlog,
    getAllBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getUserBlog,
}