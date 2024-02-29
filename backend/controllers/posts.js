// real login lies her,how the system works

import Post from "../models/Post.js";
import User from "../models/User.js";



// CREATE
export const createPost=async(req,res)=>{
    try {
        const {userId,description,picturePath}=req.body;
        const user=await User.findById(userId);

        const newPost=new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,//dp
            picturePath,//post wala picture
            likes:{},
            comments:[],

        })
        await newPost.save();//saving new post

        const post=await Post.find();//grabbing all posts
        res.status(201).json(post);//showing all posts
        
    } catch (err) {
        res.status(409).json({message:err.message});
    }
} 

// READ
export const getFeedPosts=async(req,res)=>{
    try {
        const post=await Post.find();//grabbing all posts
        res.status(200).json(post);//showing all posts
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }
}

export const getUserPosts=async(req,res)=>{
    try {
        const {userId}=req.params;
        const post=await Post.find({userId});//grabbing user posts
        res.status(200).json(post);//showing user posts
        
    } catch (err) {
        res.status(404).json({message:err.message});
        
    }
}

// update
export const likePost=async(req,res)=>{
    try {
        const {id}=req.params;
        const {userId}=req.body;
        // console.log("arara");
        const post=await Post.findById(id);
        const isLiked=post.likes.get(userId);//user liking/disliking post


        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);

        }

        const updatedPost=await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        );
       
        res.status(200).json(updatedPost);
        
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

}











