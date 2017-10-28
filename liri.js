function runLiri(){
    var keys = require("./keys.js");
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitterKeys);
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotifyKeys);
    var request = require("request");
    var apiSelector = process.argv[2];
    var fs = require('fs');

    function myTweets(){
        if(apiSelector === 'my-tweets'){
        //This will show your last 20 tweets and when they were created at in your terminal/bash window.
            var params = {
                screen_name: "jkbtcamp18"
            };

            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < tweets.length; i++){
                        console.log("On " + new Date(tweets[i].created_at).toLocaleString());
                        console.log("You tweeted: " + tweets[i].text);
                    }
                }
            });
        }
    }
    myTweets();

    function spotifyThis(){    
        if(apiSelector === 'spotify-this-song'){
            var query = process.argv;
            var songSearch = "";
            for (var i = 3; i < query.length; i++){
                if(i > 3 && i < query.length){
                    songSearch = songSearch + "+" + query[i];
                }
                else{
                    songSearch += query[i];
                }
            }
            if(query.length < 4){
                songSearch = "Ace+of+Base+The+Sign"; 
            }
            spotify.search({ type: 'track', query: songSearch, limit: 1 }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                console.log("Song Title: " + data.tracks.items[0].name);
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Open in Spotify (ctrl + click): " + data.tracks.items[0].external_urls.spotify);
                if (data.tracks.items[0].preview_url === null){
                    console.log("Preview: No Preview Available");
                }
                else{
                    console.log("Play Preview (ctrl + click): " + data.tracks.items[0].preview_url)
                }                   
            });

        }
    }
    spotifyThis();

    function movieThis(){
    
        if(apiSelector === 'movie-this'){
            
            var query = process.argv;        
            // Create an empty variable for holding the movie name
            var movieName = "";
            
            // Loop through all the words in the node argument
            // And do a little for-loop magic to handle the inclusion of "+"s
            for (var i = 3; i < query.length; i++) {
            
            if (i > 3 && i < query.length) {        
                movieName = movieName + "+" + query[i];        
            }        
            else {        
                movieName += query[i];        
            }
            }
            if(query.length < 4){
                movieName = "Mr.+Nobody"; 
            }        
            // Then run a request to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
            
            // This line is just to help us debug against the actual URL.
            console.log(queryUrl);
            
            request(queryUrl, function(error, response, body) {
            
            // If the request is successful
            if (!error && response.statusCode === 200) {
            
                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("imdb Score: " + JSON.parse(body).imdbRating);
                console.log("RottenTomatoes: " + JSON.parse(body).Ratings[1].Value);
                console.log("Produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);  
                console.log("Cast: " + JSON.parse(body).Actors);
                console.log("Rated: " + JSON.parse(body).Rated);
            }
            });
            
        }
    }
    movieThis();

    function doWhatItSays(){    
        if(apiSelector === 'do-what-it-says'){
            fs.readFile("random.txt", 'utf8', function(err, response){
                if(err){
                    return console.log("error");
                }

                dataArray = response.split(",");
                console.log(dataArray);

                if(dataArray[0] === 'spotify-this-song'){

                    spotify.search({ type: 'track', query: dataArray[1], limit: 1 }, function(err, data) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        }
                        console.log("Song Title: " + data.tracks.items[0].name);
                        console.log("Artist: " + data.tracks.items[0].artists[0].name);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("Open in Spotify (ctrl + click): " + data.tracks.items[0].external_urls.spotify);
                        if (data.tracks.items[0].preview_url === null){
                            console.log("Preview: No Preview Available");
                        }
                        else{
                            console.log("Play Preview (ctrl + click): " + data.tracks.items[0].preview_url)
                        }                   
                    });                    
                }
            })           
        }
    }
    doWhatItSays();
}

runLiri();


