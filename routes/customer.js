import { Router } from 'express';
import { Customer, validateCustomer } from '../models/customerModel.js'
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

export const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id).sort('name');

    if (!customer)
        return res.status(404).send('Customer not found by the given ID.');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }, { new: true }
    );

    res.send(customer);
});

router.delete('/:id', admin, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    res.send(customer);
});

