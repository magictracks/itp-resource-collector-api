const fs = require('fs');
const rp = require('request-promise');
const Q = require('q')
const { exec } = require('child_process');

const data = JSON.parse(fs.readFileSync('data/videoDetails.json'));

let output = [];

// throw the videos into 
data.forEach(video => {
    output.push(formatData(video))
})


function formatData(video) {
    let d = {
        title: '',
        url: '',
        desc: '',
        tags: [],
        checkedTypes: [],
        levelRating: [],
        timeCommitment: [],
        imageUrl: '',
        submittedBy: [],
        keywordExtraction: [],
        submissionCount: 1,
        dateSubmitted: new Date(Date.now()),
        dateUpdated: new Date(Date.now()),
        dateExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    }

    d.title = video.items[0].snippet.title
    d.desc = video.items[0].snippet.description
    d.url = `https://www.youtube.com/watch?v=${video.items[0].id}`
    d.tags = createCounterJson(video.items[0].snippet.tags)
    d.checkedTypes.push("video")
    d.checkedTypes = createCounterJson(d.checkedTypes)
    // d.levelRating.push()
    d.timeCommitment.push(parseDuration(video.items[0].contentDetails.duration))
    d.timeCommitment = createCounterJson(d.timeCommitment)
    d.imageUrl = video.items[0].snippet.thumbnails['default'].url

    return d;
}


// function formatData(video) {
//     let d = {
//         title: '',
//         url: '',
//         desc: '',
//         tags: [],
//         checkedTypes: [],
//         levelRating: [],
//         timeCommitment: [],
//         imageUrl: '',
//         submittedBy: [],
//         keywordExtraction: []
//         // submissionCount: 1,
//         // dateSubmitted: Date.now(),
//         // dateUpdated: Date.now(),
//         // dateExpires: Date.now() + 1000 * 60 * 60 * 24 * 365
//     }

//     d.title = video.items[0].snippet.title
//     d.desc = video.items[0].snippet.description
//     d.url = `https://www.youtube.com/watch?v=${video.items[0].id}`
//     d.tags = video.items[0].snippet.tags
//     d.checkedTypes.push("video")
//     // d.checkedTypes = createCounterJson(d.checkedTypes)
//     // d.levelRating.push()
//     d.timeCommitment.push(parseDuration(video.items[0].contentDetails.duration))
//     // d.timeCommitment = createCounterJson(d.timeCommitment)
//     d.imageUrl = video.items[0].snippet.thumbnails['default'].url

//     return d;
// }

function createCounterJson(arr) {
    if (arr !== undefined) {
        const output = arr.map((item) => {
            return { property: item, count: 1 };
        })
        return output;
    } else {
        console.log('no array')
    }
}



function parseDuration(time) {
    let output;

    output = time.split(/[PTHMS]+/)
    output = output.filter(d => d !== "")

    if (output.length == 3) {
        let timeVal = output[0];
        if (timeVal == 1) {
            return '1 hr - 2 hr'
        } else if (timeVal > 1) {
            return '> 2 hr'
        }
    } else if (output.length == 2) {
        if (output[0] < 30) {
            return '< 30 min'
        } else {
            return '30 min - 1 hr'
        }
    }
}

function post2Mongo(video) {
    let options = {
        method: 'POST',
        uri: "http://127.0.0.1:5000/api/resources",
        body: video,
        json: true
    }

    return rp(options)
        .then(results => {
            return results
        }).catch(err => {
            return err
        })

}


console.log(output.length)

/*@@
@ issues with write speed?
*/
// Q.all(output.map(video => post2Mongo(video))).then( results => {
//   return results
// }).catch( err =>{
//   console.log(err)
// })

// fs.writeFile("data/videoDetailsFormatted.json", JSON.stringify(output), (err, data) => {
// 	if(err) return err
// 	console.log("written to file!")
// });


/*@@
@ Alternatively write to db via file
*/
fs.writeFile("data/videoDetailsFormatted.json", JSON.stringify(output), (err, data) => {

    exec('mongoimport --drop --db itp-tagged-resources --collection resources data/videoDetailsFormatted.json --jsonArray', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }

        console.log(`Number of files ${stdout}`);
    });

})