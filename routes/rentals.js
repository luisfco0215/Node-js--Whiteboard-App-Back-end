import { Router, json } from 'express';
import { Rentals, validateRental as validate } from '../models/rentalsModel.js';
import { Customer } from '../models/customerModel.js';
import { Movies } from '../models/moviesModel.js';
import { getDaysBetween } from '../common/commonMethods.js'
import { auth } from '../middleware/auth.js';

export const routes = Router();
routes.use(auth);

routes.get('/', async (req, res) => {
    const rentals = await Rentals.find().sort('-dateOut');
    res.send(rentals);
});

routes.get('/:id', async (req, res) => {
    const rental = await Rentals.findById(req.params.id);
    if (!rental) return res.status(404).send('Not rental by the given ID.');

    res.send(rentals);
});

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('Invalid customer');

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Invalid movie');

    if (movie.numberInStock == 0) return res.send('Movie is not in stock.');

    let rental = new Rentals({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    rental = await rental.save();
    movie.numberInStock--;
    movie.save();

    res.send(rental);
});

routes.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let rental = await Rentals.findById(req.params.id);
    if (!rental) return res.status(404).send('Not rental found by the given ID.');

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Invalid movie');

    const daysRented = getDaysBetween(rental.dateOut);

    if (rental.movieId == req.body.moveId) {

        rental.dateReturned = new Date();
        movie.numberInStock++;
    } else {
        if (movie.numberInStock == 0) return res.send('Movie is not in stock.');

        rental.movie._id = movie._id;
        rental.title = movie.title;
        rental.dailyRentalRate = movie.dailyRentalRate;
    }

    rental.rentalFee = Math.round(daysRented * movie.dailyRentalRate);

    rental = await rental.save();
    movie.save();

    res.send(rental);
});

