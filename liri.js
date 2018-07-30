const dotenv = require("dotenv").config();

const cmd = require('node-command-line');

const request = require('request');

const Spotify = require('node-spotify-api');

const Twitter = require('twitter');

const NewsAPI = require('newsapi');

const keys = require('./keys.js');

const fs = require('fs');

const newsapi = new NewsAPI(keys.newsapi.key);
var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

var command = process.argv[2];
var userQuery = process.argv[3];

if (command === 'my-news' && userQuery !== null) {
    newsapi.v2.topHeadlines({ q: userQuery, language: 'en' }).then(
        function (response) {

            if (response.status === 'ok') {
                // console.log(JSON.stringify(response, null, 2));
                console.log('\n' + '---------------------------------------------');
                for (var i = 0; i < response.articles.length; i++) {
                    console.log('\n' + 'Title: ' + response.articles[i].title,
                        '\n' + 'Source: ' + response.articles[i].source.name);

                    if (response.articles[i].author !== null) {

                        console.log('Author: ' + response.articles[i].author);

                    }

                    console.log('Date and Time of Publication: ' + response.articles[i].publishedAt,
                                '\n' + 'Link to article: ' + response.articles[i].url,
                                '\n' +'\n' + '---------------------------------------------');
                }

            }
        });
}

if (command === 'spotify-this-song' && userQuery === undefined) {

    spotify.search({ type: 'track', query: 'The Sign'}).then(function(response){
        console.log('\n' + 'Track name: ' + response.tracks.items[5].name,
                    '\n' + 'Artist name: ' + response.tracks.items[5].artists[0].name,
                    '\n' + 'Album: ' + response.tracks.items[5].album.name,
                    '\n' + 'Preview Link: ' + response.tracks.items[5].preview_url);
    });
}


else if (command === 'spotify-this-song') {

    encodeURI(userQuery);

    spotify.search({ type: 'track', query: userQuery }).then(function (response) {

        for (var i = 0; i < response.tracks.items.length; i++) {

            console.log('Track Name: ' + response.tracks.items[i].name)

            for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
                console.log('Artist Name(s): ' + response.tracks.items[i].artists[j].name);

            }

            console.log('Album: ' + response.tracks.items[i].album.name);

            if(response.tracks.items[i].preview_url !== null){
            console.log('Preview the song here: ' + response.tracks.items[i].preview_url);
            }

            console.log('----------------------------------------------');
        }
    });

}

if (command === 'movie-this' && userQuery === undefined) {

    request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=Mr.+Nobody'
        , function (error, response, body) {

            // If there were no errors and the response code was 200 (i.e. the request was successful)...
            if (!error && response.statusCode === 200) {

                var movie = JSON.parse(body);
                console.log('-----------------------------',
                    "\n" + "Title: " + movie.Title,
                    "\n" + "Year: " + movie.Year,
                    "\n" + "IMDB Rating: " + movie.imdbRating,
                    "\n" + "Rotten Tomatoes Rating: " + movie.Ratings[1].Value,
                    "\n" + "Countries involved in production: " + movie.Country,
                    "\n" + "Language(s): " + movie.Language,
                    "\n" + "Plot: " + movie.Plot,
                    "\n" + "Actors: " + movie.Actors);
            }
        });
}

else if (command === 'movie-this') {

    request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=' + userQuery
        , function (error, response, body) {

            // If there were no errors and the response code was 200 (i.e. the request was successful)...
            if (!error && response.statusCode === 200) {

                var movie = JSON.parse(body);
                console.log('-----------------------------',
                    "\n" + "Title: " + movie.Title,
                    "\n" + "Year: " + movie.Year,
                    "\n" + "IMDB Rating: " + movie.imdbRating,
                    "\n" + "Rotten Tomatoes Rating: " + movie.Ratings[1].Value,
                    "\n" + "Countries involved in production: " + movie.Country,
                    "\n" + "Language(s): " + movie.Language,
                    "\n" + "Plot: " + movie.Plot,
                    "\n" + "Actors: " + movie.Actors);
            }
        });
}

if (command === 'do-what-it-says') {

    var text = fs.readFileSync('random.txt', 'utf8');

    var textArr = text.split(', ');
    
    console.log('\n');
    
    cmd.run('node liri.js ' + textArr[0] + ' "' + textArr[1] + '"');
 
}
