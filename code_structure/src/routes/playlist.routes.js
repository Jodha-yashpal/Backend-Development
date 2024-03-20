import { Router } from "express";
import {addVideoToPlaylist, createPlaylist, deletePlaylist, updatePlaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route('/').post(createPlaylist);

router.route('/:playlistId')
.patch(updatePlaylist)
.delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);


export default router