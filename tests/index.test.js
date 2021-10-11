const movieJs = require('../lib/index.js',);

const movies = new movieJs(process.env.API_KEY,); // API key goes here

test('Search', () => {
	expect(movies.search('Star wars',),).resolves.toBeTruthy();
},);

test('Search with options', () => {
	expect(
		movies.search('Star wars', { type: '', year: 1999, page: 1, },),
	).resolves.toBeTruthy();
},);

test('Get movie by ID', () => {
			  expect(movies.get('tt1285016',),).resolves.toBeTruthy();
},);

test('Get movie by ID with options', () => {
	expect(movies.get('tt1285016', {
		plot: 'full',
	},),).resolves.toBeTruthy();
},);
/*
test("Get movie by ID from object",  () => {
  expect(movies.get({
    "ID":"ttt1285016" })).resolves.toBeTruthy();
});
*/
test('Get movie by Title', () => {
	expect(movies.getByTitle('Good Burger',),).resolves.toBeTruthy();
},);

test('Get movie by Title with options', () => {
	expect(movies.getByTitle('Good Burger', {
		plot: 'full',
		type: 'movie',
		year: 1997,
	},),).resolves.toBeTruthy();
},);

test('Get movie poster', () => {
	expect(movies.getPoster('tt1285016', {
		plot: 'full',
	},),).resolves.toBeTruthy();
},);

test('Get movie poster from object', () => {
	expect(movies.getPoster({ ID: 'ttt1285016', },),).resolves.toBeTruthy();
},);
