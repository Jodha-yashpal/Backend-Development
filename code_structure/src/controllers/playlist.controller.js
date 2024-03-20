import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    try {
        //fetch
        const {name, description} = req.body
        console.log(req.body)
    
        //validate name and discription
        if (!(name && description)) {
            throw new ApiError(402, "name and description both are required")
        }
    
        //create playlist
        const playlistCreated = await Playlist.create({
            name,
            description,
            owner: req.user._id
        })
    
        //check if playlist is created
        if (!playlistCreated) {
            throw new ApiError(408, "Something went wrong while creating the playlist")
        }
        
        //return
        return res
        .status(200)
        .json(
            new ApiResponse(200, playlistCreated, "Successfully created the playlist")
        )
    } catch (error) {
        console.log("error while creating playlist: ", error)
        throw new ApiError(500, "Internal Server Error")
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        //fetch
        const {playlistId, videoId} = req.params
    
        //validation on playlistId and videoId
        const playlist = await Playlist.findById(playlistId)
    
        if (!playlist) {
            throw new ApiError(404, "playlist not exist")
        }
    
        const video = await Video.findById(videoId)
    
        if (!video) {
            throw new ApiError(404, "video not exist")
        }
    
        // Add the videoId to the videos array in the playlist document
        playlist.videos.push(videoId)
    
        //save
        await playlist.save({validateBeforeSave: false})
    
        //return
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Successfully added the video")
        )

    } catch (error) {
        console.log("error while adding video to playlist: ", error)
        throw new ApiError(500, "Internal server error ")
    }
})

export {
    createPlaylist,
    addVideoToPlaylist
}