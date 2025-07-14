import { connect, Mongoose, model } from 'mongoose';


connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not conect to MongoDB', err));


const coursesSchema = new Mongoose().Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Courses = model('courses', coursesSchema);

const getExercise = async () => {
    return await Courses
        .find({ isPublished: true })
        .or([
            { price: { $gte: 15 } },
            { name: /.*by*./ }])
        .sort({ price: -1 })
        .select({ name: 1, author: 1, price: 1 })

}

getExercise().then(courses => console.log(courses));
