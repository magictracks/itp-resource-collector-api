const express = require('express'),
			app = express(),
			port = process.env.PORT || 5000,
			bodyParser = require('body-parser'),
			mongoose = require("mongoose"),
			rp = require('request-promise'),
			cors = require('cors');

// App settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Get the db as spec'd in the models directory
// includes an index which gathers all the schema together
const db = require("./models");

//Bind connection to error event (to get notification of connection errors)
// NOTE: db.Resource
// could also be db.User...etc etc remember we pull from /models/...
db.Resource.on('error', console.error.bind(console, 'MongoDB connection error:'));



// send me to this link
app.get('/', (req, res) => {
	res.send("Hello!");
})


// TODO: auth stuff






// API endpoints here
/**
@ GET: /api/resources
@ Send all the resources as json
@*/
app.get('/api/resources', (req, res, next) => {

	db.Resource.find()
		.then(function(resources){
		    res.json(resources);
		})
		.catch(function(err){
		    res.send(err);
		})

})

/**
@ GET: /api/resources/:title
@ Send resource as json by title
@*/
app.get('/api/resources/:id', (req, res, next) => {

	console.log(req.params)
	db.Resource.findOne(
		{_id: req.params.id }
		)
		.then(function(resource){
		    res.json(resource);
		})
		.catch(function(err){
		    res.send(err);
		})

})


/**
@ GET: /api/resources
@ Send all the resources as json
@*/
function uniq(a) {
   return Array.from(new Set(a));
}

app.get('/api/tags/', (req, res, next) => {

	db.Resource.find()
		.then(function(resources){
				let tags = [];

				resources.forEach(item => {
					item.tags.forEach(tag => {
						tags.push(tag.property);
					})
				})
				tags = uniq(tags);
		    res.json(tags);
		})
		.catch(function(err){
		    res.send(err);
		})

})

/**
@ POST/PUT: /api/resources
@ Find a resource based on the url
@ if it exists, then update it 
@ if it doesn't exist, then add it

TODO:
- create k,v pairs from array items
- increment each unique item
@*/
function createCounterJson(arr){
	const output = arr.map((item) => {
		return {property: item, count: 1};
	})
	return output;
}

/**
@ compare new and old arrays
@ increment count for the old items
@ add the new items
@ TODO: optimization! lots of looping probably can be avoided
*/
function incrementCount(existingArr, newArr){
	let newProps = newArr.map(item => item.property )
	let existingProps = existingArr.map(item => item.property )

	let result =[];
	existingArr.forEach(existingItem => {
		if(newProps.includes(existingItem.property) === true){
			existingItem.count++;
			result.push(existingItem);
		} else{
			result.push(existingItem);
		}
	})
	newArr.forEach(newItem => {
		if(existingProps.includes(newItem.property) !== true){
			result.push(newItem)
		}
	})
	return result
}

app.post('/api/resources', (req, res, next) => {

	let incomingResource = Object.assign({}, req.body);
	incomingResource.tags = createCounterJson(incomingResource.tags)
	incomingResource.checkedTypes = createCounterJson(incomingResource.checkedTypes)
	incomingResource.levelRating = createCounterJson(incomingResource.levelRating)
	incomingResource.timeCommitment = createCounterJson(incomingResource.timeCommitment)
	incomingResource.submittedBy = createCounterJson(incomingResource.submittedBy)

	db.Resource.findOne({"url": req.body.url})
		.then(function(resource){
		    console.log(resource)
		    // if the resource does not exist, make a new one
		    // else, update the existing one
		    if(resource === null){
		    	// create a new document
		    	db.Resource.create(incomingResource)
		    		.then(newResource => {
		    			res.status(201).json(newResource);
		    		})
		    		.catch(err => {
		    			res.send(err);
		    		});

		    } else {
		    	db.Resource.update(
		    		{"url": req.body.url},
		    		{
		    			$set:{
		    				"tags": incrementCount(resource.tags, incomingResource.tags),
		    				"checkedTypes": incrementCount(resource.checkedTypes, incomingResource.checkedTypes),
		    				"levelRating": incrementCount(resource.levelRating, incomingResource.levelRating),
		    				"timeCommitment": incrementCount(resource.timeCommitment, incomingResource.timeCommitment),
		    				"submittedBy": incrementCount(resource.submittedBy, incomingResource.submittedBy),
		    				"dateUpdated": Date.now(),
		    				"dateExpires": Date.now() + 1000*60*60*24*365
		    			},
		    			$inc:{
		    				"submissionCount":1
		    			}
		    		},
		    		{new:true }
		    	)
		    	.then(updatedResource => {
		    		console.log(updatedResource)
	    			res.status(201).json(updatedResource);
	    		})
	    		.catch(err => {
	    			res.send(err);
	    		})
		    }
		})
		.catch(function(err){
		    res.send(err);
		    // console.log("no item found")
		})

});



app.listen(port , () => {
  console.log('App listening on port ' + port) 
});