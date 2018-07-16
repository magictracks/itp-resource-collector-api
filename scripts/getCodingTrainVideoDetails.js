require('dotenv').config();
const fs = require('fs');
const rp = require('request-promise');
const Q = require('q');

let videoList = []
let promises = [];

let data = JSON.parse(fs.readFileSync("temp.json"))

// flatten the 
data.forEach( obj => {
    if(obj.items.length > 0){
        obj.items.forEach( item => {
            videoList.push(item)
        })
    } 
})

// 524 videos as of 20180710
console.log(videoList.length)

let options = {
    uri: 'https://www.googleapis.com/youtube/v3/videos',
    qs: {
        id: undefined,
        part: 'snippet,contentDetails,statistics',
        key: process.env.YOUTUBE_KEY
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};



function getVideoDetails(video){
  let videoDetailOptions = Object.assign({}, options);
  videoDetailOptions.qs.id = video.id.videoId;

  return rp(videoDetailOptions)
    .then( results => {
      console.log(results)
      return results
    }).catch( err => {
      return err
    })

}

function getStuffs(){
  Q.all(videoList.map(video => getVideoDetails(video))).then( results => {
    fs.writeFile("data/videoDetails.json", JSON.stringify(results), (err, data) =>{
          if(err) return err
          console.log("finished writing to file!")
        })
    return results
  }).catch( err =>{
    console.log(err)
  })
}
getStuffs();


/*

{
    "kind": "youtube#searchResult",
    "etag": "\\"
    DuHzAJ - eQIiCIp7p4ldoVcVAOeY / PN13SRG4qB2xErA2T3d2e - onW8A\\ "",
    "id":
    {
        "kind": "youtube#video",
        "videoId": "fcdNSZ9IzJM"
    },
    "snippet":
    {
        "publishedAt": "2016-05-30T21:27:05.000Z",
        "channelId": "UCvjgXvBlbQiydffZU7m1_aw",
        "title": "Coding Challenge #15: Fractal Trees - Object Oriented",
        "description": "In this Coding Challenge, I continue the topic of algorithmic botany with another way of generating a tree. With this method, every part of the tree will be an object ...",
        "thumbnails":
        {
            "default":
            {
                "url": "https://i.ytimg.com/vi/fcdNSZ9IzJM/default.jpg",
                "width": 120,
                "height": 90
            },
            "medium":
            {
                "url": "https://i.ytimg.com/vi/fcdNSZ9IzJM/mqdefault.jpg",
                "width": 320,
                "height": 180
            },
            "high":
            {
                "url": "https://i.ytimg.com/vi/fcdNSZ9IzJM/hqdefault.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "The Coding Train",
        "liveBroadcastContent": "none"
    }
}

*/

/*
{
    "kind": "youtube#videoListResponse",
    "etag": "\"DuHzAJ-eQIiCIp7p4ldoVcVAOeY/LmOF5c0s3oz05tOuk2bMeLy7yP8\"",
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    },
    "items": [
        {
            "kind": "youtube#video",
            "etag": "\"DuHzAJ-eQIiCIp7p4ldoVcVAOeY/B0XL8N_MLwx0E19WmO3e0dBYotQ\"",
            "id": "s70-Vsud9Vk",
            "snippet": {
                "publishedAt": "2015-11-13T02:54:57.000Z",
                "channelId": "UCvjgXvBlbQiydffZU7m1_aw",
                "title": "15.2: What is NPM? - Twitter Bot Tutorial",
                "description": "This video covers the basics of npm (node package manager).  What is node package manager?  What are some basic commands like \"init\" and \"install\"?  How do you use a Twitter package.\n\nIf you run into an issue with \"access denied\" you can try \"sudo\", i.e.  \"sudo npm install twit --save\"\n\nAll examples: https://github.com/shiffman/Video-Lesson-Materials\n\nContact: https://twitter.com/shiffman\n\nNext video:\nhttps://youtu.be/GQC2lJIAyzM\n\nLearn JavaScript basics: \nhttps://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA\n\nLearn Processing basics:\nhttps://www.youtube.com/user/shiffman/playlists?sort=dd&shelf_id=2&view=50\n\nMore about data and APIs:\nhttps://www.youtube.com/playlist?list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r\n\nHelp us caption & translate this video!\n\nhttp://amara.org/v/Qbtr/",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/s70-Vsud9Vk/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/s70-Vsud9Vk/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/s70-Vsud9Vk/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    },
                    "standard": {
                        "url": "https://i.ytimg.com/vi/s70-Vsud9Vk/sddefault.jpg",
                        "width": 640,
                        "height": 480
                    }
                },
                "channelTitle": "The Coding Train",
                "tags": [
                    "Twitterbot",
                    "Tutorial (Media Genre)",
                    "Twitter (Award-Winning Work)",
                    "Npm",
                    "Node.js (Software)",
                    "JavaScript (Programming Language)",
                    "bot",
                    "botALLY",
                    "twitter bot",
                    "node package manager"
                ],
                "categoryId": "27",
                "liveBroadcastContent": "none",
                "localized": {
                    "title": "15.2: What is NPM? - Twitter Bot Tutorial",
                    "description": "This video covers the basics of npm (node package manager).  What is node package manager?  What are some basic commands like \"init\" and \"install\"?  How do you use a Twitter package.\n\nIf you run into an issue with \"access denied\" you can try \"sudo\", i.e.  \"sudo npm install twit --save\"\n\nAll examples: https://github.com/shiffman/Video-Lesson-Materials\n\nContact: https://twitter.com/shiffman\n\nNext video:\nhttps://youtu.be/GQC2lJIAyzM\n\nLearn JavaScript basics: \nhttps://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA\n\nLearn Processing basics:\nhttps://www.youtube.com/user/shiffman/playlists?sort=dd&shelf_id=2&view=50\n\nMore about data and APIs:\nhttps://www.youtube.com/playlist?list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r\n\nHelp us caption & translate this video!\n\nhttp://amara.org/v/Qbtr/"
                },
                "defaultAudioLanguage": "en"
            },
            "contentDetails": {
                "duration": "PT13M27S",
                "dimension": "2d",
                "definition": "hd",
                "caption": "true",
                "licensedContent": true,
                "projection": "rectangular"
            },
            "statistics": {
                "viewCount": "107571",
                "likeCount": "1514",
                "dislikeCount": "31",
                "favoriteCount": "0",
                "commentCount": "136"
            }
        }
    ]
}
*/




