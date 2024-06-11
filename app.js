const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/laughing-winner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const jokeSchema = new mongoose.Schema({
    text: String,
    laughs: { type: Number, default: 0 }
});

const Joke = mongoose.model('Joke', jokeSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/jokes', async (req, res) => {
    const joke = new Joke({ text: req.body.text });
    await joke.save();
    res.status(201).send(joke);
});

app.get('/jokes', async (req, res) => {
    const jokes = await Joke.find();
    res.send(jokes);
});

app.post('/jokes/:id/laugh', async (req, res) => {
    const joke = await Joke.findById(req.params.id);
    if (joke) {
        joke.laughs += 1;
        await joke.save();
        res.send(joke);
    } else {
        res.status(404).send({ error: 'Joke not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
