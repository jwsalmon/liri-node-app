
//code to read and set any environment variables with the dotenv package
require("dotenv").config();
// Load exports from keys.js file which has Twitter auth keys
var keys = require("./keys.js");
// Load Spotify npm package
var Spotify = require('spotify');
var spotify = new Spotify(keys.spotify);
// Load request npm module
var request = require("request");
// Load moment npm module
var moment = require("moment");
// Load file system npm module
var fs = require("fs");

// node liri.js [ command ] [ query - optional ]
var command = process.argv[2];
var query = process.argv[3];

// Functions for 3 main functions of the app
// 	--> do-what-it-says requires the use of functions
var concertThis = function (artistQuery) {
    if (artistQuery === undefined) {
        artistQuery = "Paul McCartney";
    }
    request("https://rest.bandsintown.com/artists/" + artistQuery + "/events?app_id=codingbootcamp", function (error, response, body) {
        //console.log(response);
        //console.log(body);
        if (!error && response.statusCode === 200) {

            for (var i = 0; i < body.length; i++)
                console.log("Venue Name: ", body[i].venue.name);
            console.log("Venue Location: ", body[i].venue.city, ",", body[i].venue.country);
            console.log("Date of Event: ", moment(body[i].datetime, "MM/DD/YYYY"));

            //* Date of the Event (use moment to format this as "MM/DD/YYYY")
            //moment(body[i].datetime,"MM/DD/YYYY")
        }
    });
}
var spotifyThisSong = function (trackQuery) {


    // if no trackQuery is passed in, then we will be querying for this particular song
    if (trackQuery === undefined) {
        trackQuery = "the sign ace of base";
    }

    // Spotify API request (if an object is returned, output the first search result's artist(s), song, preview link, and album)
    spotify.search({ type: 'track', query: trackQuery }, function (error, data) {
        if (error) { // if error
            console.log('Error occurred: ' + error);
        } else { // if no error
            // For loop is for when a track has multiple artists
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if (i === 0) {
                    console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
                } else {
                    console.log("              " + data.tracks.items[0].artists[i].name);
                }
            }
            console.log("Song:         " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album:        " + data.tracks.items[0].album.name);
        }


    });
}

var movieThis = function (movieQuery) {


    // if query that is passed in is undefined, Mr. Nobody becomes the default
    if (movieQuery === undefined) {
        movieQuery = "mr nobody";
    }

    // HTTP GET request
    request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("* Title of the movie:         ", JSON.parse(body).Title);
            console.log("* Year the movie came out:    ", JSON.parse(body).Year);
            console.log("* IMDB Rating of the movie:   ", JSON.parse(body).imdbRating);
            console.log("* Country produced:           ", JSON.parse(body).Country);
            console.log("* Language of the movie:      ", JSON.parse(body).Language);
            console.log("* Plot of the movie:          ", JSON.parse(body).Plot);
            console.log("* Actors in the movie:        ", JSON.parse(body).Actors);

            // For loop parses through Ratings object to see if there is a RT rating
            // 	--> and if there is, it will print it
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("* Rotten Tomatoes Rating:     ", JSON.parse(body).Ratings[i].Value);
                    if (JSON.parse(body).Ratings[i].Website !== undefined) {
                        console.log("* Rotten Tomatoes URL:        ", JSON.parse(body).Ratings[i].Website);
                    }
                }
            }
        }
    });
}

// Determine what to do base on user input command
switch (command) {
    case "concert-this":
        concertThis(query);
        break;
    case "spotify-this-song":
        spotifyThisSong(query);
        break;
    case "movie-this":
        movieThis(query);
        break;
    case "do-what-it-says":
        fs.readFile("random.txt", "utf-8", function (error, data) {
            var command;
            var query;

            if (data.indexOf(",") !== -1) {
                var dataArr = data.split(",");
                command = dataArr[0];
                query = dataArr[1];
            } else {
                command = data;
            }

            // After reading the command from the file, decides which app function to run
            switch (command) {
                case "concert-this":
                    concertThis(query);
                    break;
                case "spotify-this-song":
                    spotifyThisSong(query);
                    break;
                case "movie-this":
                    movieThis(query);
                    break;
                default:// Use case where the command is not recognized
                    console.log("Command from file is not a valid command! Please try again.")
            }
        });
        break;
    default:
        console.log("Please enter a command to run LIRI.");
}
