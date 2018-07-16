const mongoose = require('mongoose');
const resourceSchema = new mongoose.Schema({
    title: {
    	type: String,
    	required: true,
    	unique: false
    },
    url:{
    	type: mongoose.SchemaTypes.Url,
    	required: true,
    	unique: true
    },
    desc:{
    	type: String,
    	required: true,
    	unique: false
    },
    tags:{
    	type: Array,
    	required: false,
    	unique: false
    },
    checkedTypes:{
    	type: Array,
    	required: false,
    	unique: false
    },
    levelRating:{
    	type: Array,
    	required: false,
    	unique: false
    },
    timeCommitment:{
    	type: Array,
    	required: false,
    	unique: false
    },
    imageUrl:{
    	type: mongoose.SchemaTypes.Url,
    	required: false,
    	unique: false
    },
    submittedBy:{
    	type: Array,
    	required: true,
    	unique: false
    },
    keywordExtraction:{
    	type: Array,
    	required: false,
    	unique: false
    },
    submissionCount:{
        type: Number,
        required: true,
        unique: false,
        default:1
    },
    dateSubmitted:{
        type: Date, 
        required: true, 
        default: Date.now
    },
    dateUpdated:{
        type: Date, 
        required: true, 
        default: Date.now
    },
    dateExpires:{
        type: Date, 
        required: true, 
        default: new Date(Date.now() + 1000*60*60*24*365) // 1 year from creation date
    }
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;