import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const kittySchema = new mongoose.Schema({
  name: String
});

// var Kitten = mongoose.model('Kitten', kittySchema);

const Cat = mongoose.model('Cat', kittySchema);

const kitty = new Cat({ name: 'Zildjian2' });
kitty.save().then(() => console.log('meow'));

