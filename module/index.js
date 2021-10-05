const centra = require("centra");

/** OMDB client */
function cleanObject(obj) {
  const newObj = obj;
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
}

class OMDB {
  /**
 * Creates a new OMBD client
 * @constructor
 * @param {string} token - OMDB api token 
 */
  constructor(token) {
    if (!token) throw new Error("No token provided");
    this.token = token;
  }

  token() {
    return this.token;
  }

  async search(search, options) {
    if (!search) throw new Error("No search query provided");
    if (options?.page < 1 || options?.page > 100)
      throw new Error("Page has to be between 1 and 100");
    const params = {
      apiKey: this.token,
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
        searchResults.Search.map((i) => {
          return {
            title: i.Title,
            year: parseInt(i.Year),
            ID: i.imdbID,
            type: i.Type,
            poster: i.Poster,
          };
        })
      )
    );
  }

  async getByTitle(title, options) {
    if (!title) throw new Error("No title provided");
    const params = {
      t: title,
      apiKey: this.token,
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
      ratings: result.Ratings.map((i) => {
        return {
          source: i.Source,
          value:
            i.Source === "Internet Movie Database"
              ? parseFloat(i.Value) * 10
              : parseFloat(i.Value),
        };
      }),
      metaScore: parseInt(result.Metascore),
      imdbRating: parseInt(result.imdbRating),
      imdbVotes: parseInt(result.imdbVotes),
      ID: result.imdbID,
      type: result.Type,
      dvd: new Date(result.DVD),
      boxOffice: parseInt(result.BoxOffice.replace("$", "").replaceAll(",", "")),
      production: result.Production.split(/,\s?/gi),
      website: result.Website === "N/A" ? null : result.Website,
    };
  }

  async get(inputID, options) {
    let ID;
    if(inputID?.ID){
      ID = inputID.ID
    } else if(inputID?.ID){
      ID = inputID
    } else {
      throw new Error("No ID provided")
    }
    const params = {
      i: ID,
      apiKey: this.token,
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
      ratings: result.Ratings.map((i) => {
        return {
          source: i.Source,
          value:
            i.Source === "Internet Movie Database"
              ? parseFloat(i.Value) * 10
              : parseFloat(i.Value),
        };
      }),
      metaScore: parseInt(result.Metascore),
      imdbRating: parseInt(result.imdbRating),
      imdbVotes: parseInt(result.imdbVotes),
      ID: result.imdbID,
      type: result.Type,
      dvd: new Date(result.DVD),
      boxOffice: parseInt(result.BoxOffice.replace("$", "").replaceAll(",", "")),
      production: result.Production.split(/,\s?/gi),
      website: result.Website === "N/A" ? null : result.Website,
    };
  }
  
}

module.exports = OMDB;