import { Router } from "express";
import { Users, validateUser as validate } from '../models/userModel.js';
import { genSalt, hash } from 'bcrypt';
import { admin } from "../middleware/admin.js";
import { auth } from "../middleware/auth.js";
import _ from 'underscore';

export const routes = Router();

routes.get('/', async (req, res) => {
    const users = await Users.find().sort('name').select('-password');
    res.send(users);
});

routes.get('/:id', async (req, res) => {
    const user = await Users.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('Not user found by the given ID.')

    res.send(user);
});

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(user);
});

routes.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Users.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin
    }, { new: true });

    res.send(_.omit(user, ['password']));
});

routes.delete('/:id', admin, async (req, res) => {
    const user = await Users.deleteOne({ _id: req.params.id });
    res.send(user);
});