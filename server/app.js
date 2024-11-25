const express = require("express")
const app = express()

app.use('/', (req, res, next) => {
    res.send('<h1>Welcome to POSTIVIBE server</h1>')
})

app.listen(3000, () => {
    console.log('server started')
})