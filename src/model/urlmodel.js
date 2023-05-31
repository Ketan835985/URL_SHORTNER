const mongoose =require('mongoose');
const shortId=require('shortid')

const urlSchema= new mongoose.Schema({
 
    urlCode:{
        type:String,
        required:true,
        trim:true
    },
    longUrl:{
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
        default:shortId.generate()
    }
});

module.exports= mongoose.Model('url',urlSchema);
// model is ready