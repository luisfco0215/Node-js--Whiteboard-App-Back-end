import { Router } from "express";
import { Users } from '../models/userModel.js';
import { compare } from 'bcrypt';
import Joi from 'joi';

export const routes = Router();

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const isValidPassword = await compare(req.body.password, user.password)
    if (!isValidPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

export const validate = (body) => {
    const userSchema = Joi.object({
        email: Joi.string().required().min(5).max(70),
        password: Joi.string().required().max(255)
    });

    return userSchema.validate(body);
};