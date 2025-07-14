import Joi from "joi";
import { model, Mongoose } from 'mongoose';

export const genreSchema = new Mongoose().Schema({
    genre: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    }
})

export const Genres = model('Genres', genreSchema);

export function validateGenre(body) {
    const schema = Joi.object({
        id: Joi.number().optional(),
        genre: Joi.string().min(3).required()
    });

    return schema.validate(body);
}
