import Joi from 'joi';
import { Mongoose, model } from 'mongoose';
import { genreSchema } from './genreModel.js';

export const Movies = model('Movies', new Mongoose().Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
}));

export const validateMovie = (body) => {
    const movieSchema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string().required(),
        numberInStock: Number,
        dailyRentalRate: Number
    });

    return movieSchema.validate(body);
}

