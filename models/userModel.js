import { model, Mongoose } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';

const userSchema = new Mongoose().Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 70
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

export const Users = model('Users', userSchema);

export const validateUser = (body) => {
    const userSchema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(70),
        password: Joi.string().required().min(8).max(100),
        isAdmin: Joi.bool().optional()
    });

    return userSchema.validate(body);
};