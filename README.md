# Movie.js
[![NPM downloads](https://img.shields.io/npm/dw/movie.js?style=for-the-badge)](https://www.npmjs.com/package/movie.js) [![License](https://img.shields.io/npm/l/movie.js?style=for-the-badge)](https://choosealicense.com/licenses/mit/)  [![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/movie.js?style=for-the-badge)](https://npmjs.com/movie.js) 

An advanced api wrapper for the [OMDB API](http://www.omdbapi.com/)

## Features:
- Lightweight - Only one dependency
- Object-oriented
- Promise and async/await support
- Easy-to use syntax 
- Advanced error handling - Catch errors before you send them to the API
- 100% API support - The whole [OMDB API](http://www.omdbapi.com/) is documented and covered
- High-level api - start hacking in just a few lines!
## Installation
```sh
npm install movie.js
```
## Usage 
```js
const movieJs = require("movie.js");
const movies = new movieJs(process.env.API_KEY); // API key goes here
```
_Wrap the following code in an await function to use async/await. [More info](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)_
### Search for movies
```js
await movies.search("Star Wars"); // Search for star wars movies

await movies.search("Star Wars", { // Search with options
	type: "", // Either movie, series, or episode
	year: 1999, // Shows search results of movies released that year 
	page: 1, // Pagination 1-100
}); 
```
### Get movie by IMDB ID
```js
await movies.get("tt1285016"); // Get movie by ID

await movies.get("tt1285016", { // Get movie by ID with options
	plot : "full", // Whether to return a "short" or "full" plot
});

const movie = await movies.search("Star Wars"); // Search for a movie
await movies.get(movie[0]); // Get more info on the first movie
```
### Get movie by title
```js
await movies.getByTitle("Good Burger"); // Get movie by title

await movies.getByTitle("Good Burger", {
	plot: "full", // Whether to return a "short" or "full" plot
	type: "movie", // Either movie, series, or episode
	year: 1997, // What year the returned movie should be
});
```
### Get movie poster
```js
await movies.getPoster("tt1285016"); // Get poster image as a buffer 
```
## License
[MIT](https://choosealicense.com/licenses/mit/)