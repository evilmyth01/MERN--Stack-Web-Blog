import { Router } from "express";
import { createBlog,getAllBlog,updateBlog,deleteBlog, getBlogById, getUserBlog } from "../controllers/blog.controller.js";

const router = Router();

router.route('/all-blog').get(getAllBlog);
router.route('/get-blog/:id').get(getBlogById);
router.route('/user-blog/:id').get(getUserBlog);



router.route('/create-blog').post(createBlog);
router.route('/update-blog/:id').put(updateBlog);
router.route('/delete-blog/:id').delete(deleteBlog);

export default router;
