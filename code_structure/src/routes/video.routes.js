import {Router} from "express"
import {deleteVideo, getVideoById, publishAVideo, updateVideo} from "../controllers/video.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route('/').post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]),publishAVideo)

router.route('/:videoId')
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single('thumbnail') ,updateVideo)

export default router