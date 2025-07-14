import express from 'express';
import { Genres, validateGenre } from '../models/genreModel.js';
import { auth } from '../middleware/auth.js'

export const routes = express.Router();
routes.use(auth);

routes.get('/', async (req, res) => {
    const genres = await Genres.find().select('genre');
    res.send(genres)
});

routes.get('/:id', async (req, res) => {
    const genre = await Genres.findById(req.params.id);

    if (!genre)
        return res.status(404).send('Not genre found by the given ID');

    res.send(genre);
});

routes.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    let genre = new Genres({ genre: req.body.genre });
    genre = await genre.save();

    res.send(genre);
});

routes.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id,
        { genre: req.body.genre }, { new: true });

    if (!genre)
        return res.status(404).send('Not genre found by the given ID');

    res.send(genre);
});

routes.delete('/:id', async (req, res) => {
    const genre = await Genres.deleteOne({ _id: req.params.id });

    if (!genre)
        return res.status(404).send('Not genre found by the given ID');

    res.send(genre);
});

