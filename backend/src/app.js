import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/blogs',blogRouter);


export default app;