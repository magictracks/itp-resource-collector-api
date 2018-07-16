require('dotenv').config();
const fs = require('fs');
const rp = require('request-promise');

let output = []

let options = {
    uri: 'https://www.googleapis.com/youtube/v3/search',
    qs: {
        key: process.env.YOUTUBE_KEY,
        part : 'snippet',
        channelId : process.env.YOUTUBE_CHANNEL_ID,
        type : 'video',
        maxResults: 50
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


function getVideos(data){

	let newOptions = Object.assign({}, options);

	if(data !== undefined){
			if(data.nextPageToken){
				console.log(data.nextPageToken)
				newOptions.qs.pageToken = data.nextPageToken	
			} else{
				return false;
			}
	} 

	return rp(newOptions).then( newResults => {
		output.push(newResults)
		console.log(output.length)
		return newResults
	}).catch( err => {
		console.log("err!")
		return err;
	})


} 


function getPages(results){
	console.log(results)

	getVideos(results)
		.then(newResults => {
			if(newResults.nextPageToken){
				getPages(newResults)
			} else{
				console.log('stop!')

				// write out the data to file
				fs.writeFile("data/videoIds.json", JSON.stringify(output), (err, data) =>{
					if(err) console.log(err);
					console.log("written to file!")
				})
				return false
			}
		})
		.catch( err => {
			return err;
		})

}
getPages();

