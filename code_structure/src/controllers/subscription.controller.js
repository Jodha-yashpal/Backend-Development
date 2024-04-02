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
        console.log(req.user._id)
    
        // Validate channelId and subscriberId
        // if (!mongoose.Types.ObjectId.isValid(channelId) || !mongoose.Types.ObjectId.isValid(subscriberId)) {
        //     throw new ApiError(400, "Invalid channelId or subscriberId");
        // }
    
        //check if document already exists
        const filter = {
            subscriber: req.user._id,
            channel: channelId
        }

        const deleteSubscription = await Subscription.deleteOne(filter).populate()
        let isSubscribed = false

        if (deleteSubscription.deletedCount === 0){
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