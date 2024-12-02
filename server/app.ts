import express, { Request, Response } from "express"
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors({
    origin: '*'
}))

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/user', userRoutes);


app.use('/', (req: Request, res: Response) => {
    res.send('<h1>Welcome to POSTIVIBE server</h1>')
    return
})

app.listen(`${process.env.PORT}`, () => {
    console.log('server started on port', `${process.env.PORT}`)
})