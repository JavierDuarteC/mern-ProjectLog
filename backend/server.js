const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

const uri = 'mongodb://mongodb:27017/log_project'

mongoose.connect(uri,{
    useNewUrlParser:true, useCreateIndex:true
}).catch(err=>console.log('Error: '+err))

const connection = mongoose.connection
connection.once('open',()=>{
    console.log('MongoDB database connection established successfully')
})

const logsRouter = require('./routes/logs')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

app.use('./logs',logsRouter)
app.use('/users', usersRouter)
app.use('/account', authRouter)

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
})