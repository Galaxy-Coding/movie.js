const centra = require("centra");

/**
 * @private
*/
function cleanObject(obj) {
	const newObj = obj;
	Object.keys(newObj).forEach((key) => {
		if (newObj[key] === undefined) {
			delete newObj[key];
		}
	});
	return newObj;
}

/** OMDB client */
class OMDB {
	/**
	 * Creates a new OMBD client
	 * @constructor
	 * @param {string} key - OMDB {@http://omdbapi.com/apikey.aspx|API key}
	 */
	constructor(key) {
		if (!key) {
			throw new Error(
				"No API key provided. Visit http://omdbapi.com/apikey.aspx to create an API key"
			);
		}
		this.key = key;
	}

	/**
	 * Search for movies
	 * @async
	 * @returns {Promise} Search results
	 * @param {string} search - Search query
	 * @param {Object} [options] - Options
	 * @param {string} [options.type] - Either movie, series, or episode
	 * @param {number} [options.year] - Shows search results of movies released that year
	 * @param {string} [options.page] - Pagination 1-100
	 */
	async search(search, options) {
		if (!search) throw new Error("No search query provided");
		if (options?.page < 1 || options?.page > 100)
			throw new Error("Page has to be between 1 and 100");
		if (options?.type) {
			if (
				options.type !== "movie" &&
				options.type !== "series" &&
				options.type !== "episode"
			)
				throw new Error("Plot must be either: movie, series, or episode");
		}
		const params = {
			apiKey: this.key,
			s: search,
			type: options?.type,
			y: options?.year,
			page: options?.page,
		};
		const res = await centra("http://www.omdbapi.com/")
			.query(cleanObject(params))
			.send();
		const searchResults = await res.json();
		if (searchResults.Response === "False")
			throw new Error(searchResults.Error);
		return JSON.parse(
			JSON.stringify(
				searchResults.Search.map((i) => ({
					title: i.Title,
					year: parseInt(i.Year),
					ID: i.imdbID,
					type: i.Type,
					poster: i.Poster === "N/A" ? null : i.Poster,
				}))
			)
		);
	}

	/**
	 * Get movie by title
	 * @async
	 * @returns {Promise} Movie object
	 * @param {string} title - The title of the movie that should be returned.
	 * @param {Object} [options] - Options
	 * @param {string} [options.type] - Either movie, series, or episode
	 * @param {number} [options.year] - Shows search results of movies released that year
	 * @param {string} [options.plot] - Whether to return a "short" or "full" plot
	 */
	async getByTitle(title, options) {
		if (!title) throw new Error("No title provided");
		if (options?.plot) {
			if (options.plot !== "short" && options.plot !== "full")
				throw new Error("Plot must be either: short or full");
		}
		if (options?.type) {
			if (
				options.type !== "movie" &&
				options.type !== "series" &&
				options.type !== "episode"
			)
				throw new Error("Plot must be either: movie, series, or episode");
		}
		const params = {
			t: title,
			apiKey: this.key,
			type: options?.type,
			y: options?.year,
			plot: options?.plot,
		};
		const res = await centra("http://www.omdbapi.com/")
			.query(cleanObject(params))
			.send();
		const result = await res.json();
		if (result.Response === "False") throw new Error(result.Error);
		return {
			title: result.Title,
			year: parseInt(result.Year),
			rated: result.Rated,
			released: new Date(result.Released),
			runtime: parseInt(result.Runtime, 10),
			genres: result.Genre.split(/,\s?/gi),
			director: result.Director,
			writers: result.Writer.split(/,\s?/gi),
			actors: result.Actors.split(/,\s?/gi),
			plot: result.Plot,
			language: result.Language,
			country: result.Country,
			awards: result.Awards === "N/A" ? null : result.Awards,
			ratings: result.Ratings.map((i) => ({
				source: i.Source,
				value:
					i.Source === "Internet Movie Database"
						? parseFloat(i.Value) * 10
						: parseFloat(i.Value),
			})),
			metaScore: parseInt(result.Metascore),
			imdbRating: parseInt(result.imdbRating),
			imdbVotes: parseInt(result.imdbVotes),
			ID: result.imdbID,
			type: result.Type,
			dvd: new Date(result.DVD),
			boxOffice: parseInt(
				result.BoxOffice.replace("$", "").replaceAll(",", "")
			),
			production: result.Production.split(/,\s?/gi),
			website: result.Website === "N/A" ? null : result.Website,
			imageUrl: `http://img.omdbapi.com/?apikey=${this.key}&i=${result.imdbID}`,
		};
	}

	/**
	 * Get movie by ID
	 * @async
	 * @returns {Promise} Movie object
	 * @param {(string|object)} ID - Either a string that contains the IMDB ID of the movie, or an object with a value called ID, that contains the movie ID.
	 * @param {Object} [options] - Options
	 * @param {string} [options.plot] - Whether to return a "short" or "full" plot
	 */
	async get(inputID, options) {
		let ID;
		if (inputID?.ID) {
			ID = inputID.ID;
		} else if (inputID) {
			ID = inputID;
		} else {
			throw new Error("No ID provided");
		}
		const params = {
			i: ID,
			apiKey: this.key,
			plot: options?.plot,
		};
		const res = await centra("http://www.omdbapi.com/")
			.query(cleanObject(params))
			.send();
		const result = await res.json();
		if (result.Response === "False") throw new Error(result.Error);
		return {
			title: result.Title,
			year: parseInt(result.Year),
			rated: result.Rated,
			released: new Date(result.Released),
			runtime: parseInt(result.Runtime, 10),
			genres: result.Genre.split(/,\s?/gi),
			director: result.Director,
			writers: result.Writer.split(/,\s?/gi),
			actors: result.Actors.split(/,\s?/gi),
			plot: result.Plot,
			language: result.Language,
			country: result.Country,
			awards: result.Awards === "N/A" ? null : result.Awards,
			ratings: result.Ratings.map((i) => ({
				source: i.Source,
				value:
					i.Source === "Internet Movie Database"
						? parseFloat(i.Value) * 10
						: parseFloat(i.Value),
			})),
			metaScore: parseInt(result.Metascore),
			imdbRating: parseInt(result.imdbRating),
			imdbVotes: parseInt(result.imdbVotes),
			ID: result.imdbID,
			type: result.Type,
			dvd: new Date(result.DVD),
			boxOffice: parseInt(
				result.BoxOffice.replace("$", "").replaceAll(",", "")
			),
			production: result.Production.split(/,\s?/gi),
			website: result.Website === "N/A" ? null : result.Website,
			imageUrl: `http://img.omdbapi.com/?apikey=${this.key}&i=${result.imdbID}`,
		};
	}

	/**
	 * Get movie poster by ID
	 * @async
	 * @returns {Promise} Buffer that contains poster image.
	 * @param {(string|object)} ID - Either a string that contains the IMDB ID of the movie, or an object with a value called ID, that contains the movie ID.
	 */
	async getPoster(inputID) {
		let ID;
		if (inputID?.ID) {
			ID = inputID.ID;
		} else if (inputID) {
			ID = inputID;
		} else {
			throw new Error("No ID provided");
		}
		const params = {
			i: ID,
			apiKey: this.key,
		};
		const res = await centra("http://img.omdbapi.com/")
			.query(cleanObject(params))
			.send();
		return res.body;
	}
}

module.exports = OMDB;
