import Joi from "joi";
import { Mongoose, model } from "mongoose";

export const rentalSchema = new Mongoose().Schema({
    customer: {
        type: new Mongoose().Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255
            },
            isGold: {
                type: Boolean
            },
            phone: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 10
            }
        }),
        required: true
    },
    movie: {
        type: new Mongoose().Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

export const Rentals = model('Rentals', rentalSchema);

export function validateRental(body) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(body);
}