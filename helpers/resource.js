/**
@ POST
@ Create a new resource

app.post('/api/resources', (req, res, next) => {

	db.Resource.create(req.body)
		.then(function(newResource){
		    res.status(201).json(newResource);
		})
		.catch(function(err){
		    res.send(err);
		})
})

@*/


/**
@ Update
@ Update an existing resource

app.update('/api/resources', (req, res, next) => {
	db.Resource.update(
		{"url": req.body.url}, 
		{
			$push:{
				"tags": req.body.tags, 
				"checkedTypes":req.body.checkedTypes,
				"levelRating":req.body.levelRating,
				"timeCommitment":req.body.timeCommitment,
				"submittedBy":req.body.submittedBy
			}
		}, 
		{new:true})
	.then(function(updatedResource){
	    res.json(updatedResource);
	})
	.catch(function(err){
	    res.send(err);
	})
})

@*/

// db.Resource.findOneAndUpdate(
// 	{"url": req.body.url}, 
// 	{
// 		$push:{
// 			"tags": req.body.tags, 
// 			"checkedTypes":req.body.checkedTypes,
// 			"levelRating":req.body.levelRating,
// 			"timeCommitment":req.body.timeCommitment,
// 			"submittedBy":req.body.submittedBy
// 		},
// 		"desc": req.body.desc,
// 		"title": req.body.title,
// 		"imageUrl": req.body.imageUrl,
// 		"keywordExtraction":req.body.keywordExtraction,
// 		"url": req.body.url
// 	}, 
// 	{upsert:true, new:true})
// .then(function(updatedResource){
//     res.json(updatedResource);
// })
// .catch(function(err){
//     res.send(err);
// })