require("dotenv").config();

// Use inquirer in hw

// Packages
var fs = require("fs");
var keys = require("./keys.js")
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify)
// var inquirer = require("inquirer");

// User Input
var userChoice = process.argv[2];
var userQuery = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
    if (i > 4 && i < process.argv.length) {
        userQuery += "+" + process.argv[i]; 
    }
    else {
        userQuery += process.argv[i];
    }
}

// console.log(userChoice);

// Create separate functions to the switch case is cleaner
switch (userChoice) {
    case "concert-this":
        concertThis();
        // console.log("Concert.");
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movies();
        // console.log("Movie.");
        break;
    case "do-what-it-says":
        doThis();
        // console.log("Do it.");
        break;
    default:
        console.log("Please enter a valid search term, such as {concert-this},");
        console.log("{spotify-this-song}, {movie-this}, or {do-what-it-says}");
        break;
}

// Spotify Function
function spotifyThis(userQuery) {

    // Catch empty input
    if (!userQuery) {
        userQuery = "The Sign Ace of Base";
    }

    spotify.search({type: "track", query: userQuery}, function(err, data) {
        if (err) {
            console.log(err);
        }

        var userSong = data.tracks.items;
        console.log("Artist: " + userSong[0].artists[0].name);
        console.log("Song Name: " + userSong[0].name);
        console.log("Preview Link: " + userSong[0].preview_url);
        console.log("Album: " + userSong[0].album.name);
    });
};

function movies(userQuery) {

    if (!userQuery) {
        userQuery = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
    }
    
    axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=" + keys.movies.id)
    .then(function(response) {

        console.log("Title: " + response.data.Title);
        console.log("Year Released: " + response.data.Year);
        console.log("IMDB rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country/Countries Produced: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Cast: " + response.data.Actors);
    });
};

function concertThis(userQuery) {

    if (!userQuery) {
        userQuery = "Slayer";
    }
    
    axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + keys.bands.id)
    .then(function(response) {
        for (var i = 0; i < response.data.length; i++) {

            console.log("Venue Name: "+ response.data[i].venue.name);
            console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
            console.log("Date of the Event: " + moment(response.data[i].datetime).format("L"));
        }
    });
}

function doThis() {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            console.log(err);
        }

        var readArray = data.split(",");
        // console.log(readArray);
        userQuery = readArray[1];
        spotifyThis(userQuery);
    })
};