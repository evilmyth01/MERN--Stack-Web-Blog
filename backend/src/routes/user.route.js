import { Router } from "express";
import { getAllUser, loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router();


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/all-user').get(getAllUser)


export default router;