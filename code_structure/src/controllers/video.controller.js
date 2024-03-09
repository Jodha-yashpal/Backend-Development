import mongoose, {connect, isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const publishAVideo = asyncHandler ( async (req, res) => {
    //fetch
    const {title, description} = req.body;

    //validation
    if(!(title || description)){
        throw new ApiError(400, "all fields are required")
    }

    //check for videofile and thumbnail
    const videoFilePath = req.files?.videoFile[0]?.path

    if(!videoFilePath) {
        throw new ApiError(404, "video file is required")
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!thumbnailPath) {
        throw new ApiError(404, "thumbnail file is required")
    }

    //upload on cloudinary
    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!(videoFile || thumbnail)){
        throw new ApiError(404, "videofile and thumbnail both are required to upload a video")
    }

    //create video object
    const videoUploaded = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    if (!videoUploaded) {
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    //return
    return res
    .status(200)
    .json(
        new ApiResponse(200, videoUploaded, "video file uploaded successfully!!!")
    )
})

export {
    publishAVideo
}