const mongoose = require('mongoose')

const Schema = mongoose.Schema

const logSchema = new Schema(
    {
        fromUsername:{
            type: String,
            required: true
        },
        toUsername:{
            type: String,
            required: true
        },
        content:{
            type: String,
            required: true
        }
    },{
        timestamps: true
    }
)

const Log = mongoose.model('Log',logSchema)

module.exports = Log