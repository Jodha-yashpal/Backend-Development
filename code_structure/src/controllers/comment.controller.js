import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {

    try {
        // Extract videoId from request parameters
        const {videoId} = req.params
    
        //check if videoId is valid
        const video = await Video.findById(videoId)
    
        if (!video) {
            throw new ApiError(404, "video not found")
        }
    
        // Extract pagination parameters from query string
        let {page = 1, limit = 10} = req.query
    
        page = parseInt(page)
        limit = parseInt(limit)
    
        // Validate page and limit parameters
        if (page < 1 || limit < 1) {
            throw new ApiError(406, "Invalid page or limit no. it should be greater than or equal to 1")
        }
    
        //aggregation pipeline to get the comments
        const comments = await Comment.aggregate([
            {
                $match: { video: new mongoose.Types.ObjectId(videoId)}
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $skip: (page - 1)*limit
            },
            {
                $limit: limit
            }
        ])
    
        //validation on comments
        if (!comments || comments.length === 0) {
            throw new ApiError(404, "no comments found for the specific video")
        }
    
        //return
        return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Successfully retrieved the comments")
        )
        
    } catch (error) {
        console.log("error: ",error)
        throw new ApiError(500, "Internal Server Error")
    }
})

const addComment = asyncHandler(async (req, res) => {

    try {
        // Extract content from request body
        const {content} = req.body;
    
        // Check if content is provided
        if (!content) {
            throw new ApiError(402, "content is required")
        }
    
        // Extract videoId from request parameters
        const {videoId} = req.params;
    
        // Check if video with the given videoId exists
        const existingVideo = await Video.findById(videoId);
    
        if (!existingVideo) {
            throw new ApiError(404, "Video not found");
        }
    
        // Create a new comment
        const commentUploaded = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id
        })
    
        // Check if comment was successfully created
        if (!commentUploaded) {
            throw new ApiError(410, "something went wrong while uploading")
        }
    
        // Respond with success message and created comment
        return res
        .status(200)
        .json(
            new ApiResponse(200, commentUploaded, "comment uploaded successfully")
        )
    } catch (error) {
        console.log("error ", error)
        throw new ApiError(500, "Internal server error")
    }
})

const updateComment = asyncHandler(async (req, res) => {
   try {
     //fetch the comment id
     const {commentId} = req.params
 
     //verify if comment id esists in database
     const comment = await Comment.findById(commentId)
 
     if (!comment) {
         throw new ApiError(404, "Comment does not exist")
     }
 
     //fetch content
     const {content} = req.body
 
     if (!content) {
         throw new ApiError(408, "content is required to update the comment")
     }
 
     //change the value of content in comment object
     comment.content = content
 
     //save in database
     await comment.save({validateBeforeSave: false})
 
     //return
     return res
     .status(200)
     .json(
         new ApiResponse(200, {}, "successfully update the comment")
     )
   } catch (error) {
        console.log("error : ", error)
        throw new ApiError(500, "Internal server error")
   }
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        //fetch the comment id
        const {commentId} = req.params

        //check for valid comment id
        const comment = await Comment.findById(commentId)

        if (!comment) {
            throw new ApiError(404, "comment not found")
        }

        //delete it
        await Comment.deleteOne({_id: commentId})

        //return 
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Successfully deleted the comment")
        )
    } catch (error) {
        console.log("error: ", error)
        throw new ApiError(500, "Internal Server Error")
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }