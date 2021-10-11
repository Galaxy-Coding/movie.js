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

  constructor(key) {
    if (!key) {
      throw new Error(
        "No API key provided. Visit http://omdbapi.com/apikey.aspx to create an API key"
      );
    }

    this.key = key;
  }
  async search(search, options) {
    if (!search) throw new Error("No search query provided");
    if (
      (options === null || options === void 0 ? void 0 : options.page) < 1 ||
      (options === null || options === void 0 ? void 0 : options.page) > 100
    )
      throw new Error("Page has to be between 1 and 100");

    if (options !== null && options !== void 0 && options.type) {
      if (
        options.type !== "movie" &&
        options.type !== "series" &&
        options.type !== "episode"
      )
        throw new Error("Plot must be either: movie, series, or episode");
    }

    let params = {
      apiKey: this.key,
      s: search,
      type: options === null || options === void 0 ? void 0 : options.type,
      y: options === null || options === void 0 ? void 0 : options.year,
      page: options === null || options === void 0 ? void 0 : options.page
    };
   		params = new URLSearchParams(params).toString();
    let res = await fetch("http://img.omdbapi.com/" + params)
   res = await res.json();
    if (searchResults.Response === "False")
      throw new Error(searchResults.Error);
    return JSON.parse(
      JSON.stringify(
        searchResults.Search.map((i) => ({
          title: i.Title,
          year: parseInt(i.Year),
          ID: i.imdbID,
          type: i.Type,
          poster: i.Poster === "N/A" ? null : i.Poster
        }))
      )
    );
  }

  async getByTitle(title, options) {
    if (!title) throw new Error("No title provided");

    if (options !== null && options !== void 0 && options.plot) {
      if (options.plot !== "short" && options.plot !== "full")
        throw new Error("Plot must be either: short or full");
    }

    if (options !== null && options !== void 0 && options.type) {
      if (
        options.type !== "movie" &&
        options.type !== "series" &&
        options.type !== "episode"
      )
        throw new Error("Plot must be either: movie, series, or episode");
    }

    let params = {
      t: title,
      apiKey: this.key,
      type: options === null || options === void 0 ? void 0 : options.type,
      y: options === null || options === void 0 ? void 0 : options.year,
      plot: options === null || options === void 0 ? void 0 : options.plot
    };
    		params = new URLSearchParams(params).toString();
    let res = await fetch("http://img.omdbapi.com/" + params)
   res = await res.json();
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
            : parseFloat(i.Value)
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
      imageUrl: `http://img.omdbapi.com/?apikey=${this.key}&i=${result.imdbID}`
    };
  }

  async get(inputID, options) {
    let ID;

    if (inputID !== null && inputID !== void 0 && inputID.ID) {
      ID = inputID.ID;
    } else if (inputID) {
      ID = inputID;
    } else {
      throw new Error("No ID provided");
    }

    let params = {
      i: ID,
      apiKey: this.key,
      plot: options === null || options === void 0 ? void 0 : options.plot
    };
    		params = new URLSearchParams(params).toString();
    let res = await fetch("http://img.omdbapi.com/" + params)
   res = await res.json();
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
            : parseFloat(i.Value)
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
      imageUrl: `http://img.omdbapi.com/?apikey=${this.key}&i=${result.imdbID}`
    };
  }
  async getPoster(inputID) {
    let ID;

    if (inputID !== null && inputID !== void 0 && inputID.ID) {
      ID = inputID.ID;
    } else if (inputID) {
      ID = inputID;
    } else {
      throw new Error("No ID provided");
    }

    let params = {
      i: ID,
      apiKey: this.key
    };
		params = new URLSearchParams(params).toString();
    let res = await fetch("http://img.omdbapi.com/" + params)
   res = await res.json();
    return res.body;
  }
}

export const OMDB;