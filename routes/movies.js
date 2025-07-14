import { Router } from 'express';
import { Movies, validateMovie as validate } from '../models/moviesModel.js'
import { Genres } from '../models/genreModel.js';
import { auth } from '../middleware/auth.js';

export const routes = Router();
routes.use(auth);

routes.get('/', async (req, res) => {
    const movies = await Movies.find().sort('title');
    res.send(movies);
});

routes.get('/:id', async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send('Not movie found by the given ID.');

    res.send(movie);
});

routes.post('/', async (req, res) => {
    const request = req.body;

    const { error } = validate(request);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Invalid genre')

    let movie = new Movies({
        title: request.title,
        genre: genre,
        numberInStock: request.numberInStock,
        dailyRentalRate: request.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);
});

routes.put('/:id', async (req, res) => {
    let movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send('Not movie found by the given ID.')

    const request = req.body;

    const { error } = validate(request);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Invalid genre')

    movie.title = request.title;
    movie.genre = genre;
    movie.numberInStock = request.numberInStock;
    movie.dailyRentalRate = request.dailyRentalRate;

    movie = await movie.save();
    res.send(movie);
});

routes.delete('/:id', async (req, res) => {
    const movie = await Movies.deleteOne({ _id: req.params.id });
    if (!movie) return res.status(404).send('Not movie found by the given ID.')

    res.send(movie);
});

