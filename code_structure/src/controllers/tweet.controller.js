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

const getUserTweets = asyncHandler(async (req, res) => {
    // fetch userId
    const {userId} = req.params

    // validate userId
    const user = await User.findById(userId).select("-password -refreshToken")

    try {
        if (!user) {
            throw new ApiError(404, "user not exist")
        }
    
        // pipeline
        const tweet = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                fullName:1,
                                username:1,
                                email:1,
                                avatar:1
                            }
                        }
                    ]
                }
            },
            {$unwind: "$owner"}
        ])
    
        // if user has not posted any tweet
        if (tweet.length === 0){
            throw new ApiError(410, "no tweet to show")
        }
    
        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Successfully retrieved all the tweets")
        )
        
    } catch (error) {
        console.log("Something went wrong in fetching user tweets : ", error)
        throw new ApiError(500, "Internal server error")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    try {
        // fetch tweetId
        const {tweetId} = req.params

        // fetch content to be updated
        const {content} = req.body

        // validate content
        if (!content) {
            throw new ApiError(400, "tweet content is required")
        }

        // fetch tweet document 
        const tweet = await Tweet.findById(tweetId)
        
        if (!(tweet && Object.keys(tweet).length)) {
            throw new ApiError(404, "tweet not found")
        }

        // update content in the document
        tweet.content = content
        
        await tweet.save()

        // return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "tweet updated successfully")
        )

    } catch (error) {
        console.log("error occured while updating the tweet: ", error)
        throw new ApiError(500, "Internal Server Error")
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet
}