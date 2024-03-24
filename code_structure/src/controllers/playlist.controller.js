import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { application } from "express"

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

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        //fetch
        const {playlistId} = req.params

        // Validate the playlistId format
        if(!mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new ApiError(400, "Invalid playlistId format")
        }

        // Check if the playlist with the provided playlistId exists
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        // If the playlist exists, delete it
        await Playlist.findByIdAndDelete(playlistId)

        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )

    } catch (error) {
        console.log("error while deleting the playlist: ",error)
        throw new ApiError(500, "Internal server error")
    }
})

const updatePlaylist = asyncHandler( async (req, res) => {
    try {
        //fetch playlistId
        const {playlistId} = req.params

        //fetch name and description
        const {name, description} = req.body

        //validate name and description
        if (!(name || description)){
            throw new ApiError(402, "name or description atleast one of the field is required")
        }

        // Fetch the playlist based on the playlistId
        const playlist = await Playlist.findById(playlistId);

        // Check if the playlist exists
        if (!playlist) {
            throw new ApiError(404, "playlist not found")
        }

        // Update the playlist's name and description
        if (name) {
            playlist.name = name;
        }
        if (description) {
            playlist.description = description;
        }

        // Save the updated playlist document
        await playlist.save({
            validateBeforeSave: false
        });

        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist updated successfully")
        )

    } catch (error) {
        console.log("error while updating playlist: ", error)
        throw new ApiError(500, "Internal server error")
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        //fetch playlistId
        const {playlistId} = req.params
    
        //check if playlist exist in database
        const playlist = await Playlist.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(playlistId)
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                }
            },
            { $unwind: '$owner' },
            {
                $project: {
                  "_id":1,
                  "name": 1,
                  "description": 1,
                  "owner.fullName": 1,
                  "owner.avatar": 1,
                  "owner.username": 1,
                  "videos": 1,
                  "createdAt":1,
                  "updatedAt":1
                }
            }
        ])
    
        //validate
        if (!playlist || playlist.length == 0) {
            throw new ApiError(404, "playlist not exist")
        }
    
        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist successfully fetched")
        )
    } catch (error) {
        throw new ApiError(500, "Interanl Server error")
    }
})

export {
    createPlaylist,
    addVideoToPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistById
}