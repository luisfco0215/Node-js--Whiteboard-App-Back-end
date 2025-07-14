import Joi from 'joi';
import { model, Mongoose } from 'mongoose';

export const Customer = model('Customer', new Mongoose().Schema({
    name: {
        type: String,
        require: true,
        min: 2,
        max: 50
    },
    phone: {
        type: String,
        require: true,
        min: 10,
        max: 10
    },
    isGold: Boolean
}));


export function validateCustomer(body) {
    const customerSchema = Joi.object({
        name: Joi.string().required().min(3).max(144),
        phone: Joi.string().required().min(10).max(10),
        isGold: Joi.bool().optional()
    });

    return customerSchema.validate(body);
}