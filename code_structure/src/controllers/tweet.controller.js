import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    try {
        //fetch content
        const {content} = req.body;
    
        //validate the tweet content
        if (!content) {
            throw new ApiError(400, "content is required")
        }
    
        //create a new tweet document
        const tweet = await Tweet.create({
            content,
            owner: req.user._id
        })
        
        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Successfully created the tweet")
        )

    } catch (error) {
        console.log("error while creating tweet : ", error)
        throw new ApiError(500, "Internal Server Error")
    }
})

export {
    createTweet
}