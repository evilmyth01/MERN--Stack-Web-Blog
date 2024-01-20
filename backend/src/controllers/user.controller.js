import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js" 
import User from "../model/user.model.js";

const registerUser = asyncHandler( async(req,res)=>{
    
    const {userName,email,password} = req.body;
    if(!userName || !email || !password){
        throw new ApiError(400,"Please fill all the fields")
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(400,"User already exists")
    }

    const user = await User.create({userName,email,password})
    await user.save();

    res.status(200).json(
        new ApiResponse(200,{user:user},"User registered successfully")
    )

}) 

const loginUser = asyncHandler(async (req,res)=>{

    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,"Please fill all the fields")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(400,"User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid credentials")
    }

    res.status(200).json(
        new ApiResponse(200,{user:user},"User logged in successfully")
    )
        
})

const getAllUser = asyncHandler(async (req,res)=>{

    const users = await User.find({}).select('-password')

    res.status(200).json(
        new ApiResponse(200,{users:users,userCount:users.length},"All users fetched successfully")
    )
})

export{
    registerUser,
    loginUser,
    getAllUser,
} 