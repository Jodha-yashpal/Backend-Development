import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        //fetch channelId(userId of the channel profile)
        const {channelId} = req.params
    
        //fetch userId(usreId of the one who is subcribing)
        const {subscriberId} = req.user._id
    
        // Validate channelId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            throw new ApiError(400, "Invalid channelId");
        }

        // Check if user is authenticated
        if (!subscriberId) {
            throw new ApiError(401, "User not authenticated");
        }

        //check if document already exists
        const filter = {
            subscriber: req.user._id,
            channel: channelId
        }

        // Toggle subscription
        const deleteSubscription = await Subscription.deleteOne(filter).populate()
        let isSubscribed = false

        if (deleteSubscription.deletedCount === 0){
            // Subscription does not exist, create a new one
            isSubscribed = true
            await Subscription.create(filter)
        }

        //return response
        return res
        .status(200)
        .json(
            new ApiResponse(200, {isSubscribed}, "successfully toggled the subscriber button")
        )
    } catch (error) {
        console.log("something went wrong while toggle subscriber: ", error)
        throw new ApiError(500, "internal server error")
    }

})

export {
    toggleSubscription,
}