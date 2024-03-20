import { Router } from "express";
import {addVideoToPlaylist, createPlaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route('/').post(createPlaylist);
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

export default router