import express, { Request, Response } from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from "http"
import { Server } from "socket.io"

import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config()

const app = express()

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

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


io.on('connection', (socket) => {
    console.log('A client connected')

    socket.on('onReaction', (data) => {
        console.log('A client give reaction on post', data)
    })

    socket.on('disconnect', () => {
        console.log('A client disconnected')
    })
})

httpServer.listen(`${process.env.PORT}`, () => {
    console.log('server started on port', `${process.env.PORT}`)
})