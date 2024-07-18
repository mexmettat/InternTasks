const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// MySQL bağlantısını ve Sequelize modelini oluşturma
const sequelize = new Sequelize('guess_game', 'root', 'password', {
    host: 'db',
    dialect: 'mysql'
});

const Guess = sequelize.define('Guess', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    guess: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    result: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Middleware
app.use(bodyParser.json());

// MySQL veritabanı bağlantısını doğrulama ve tabloyu oluşturma
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Kök URL için route ekleyin
app.get('/', (req, res) => {
    res.send('Welcome to the Guessing Game API');
});

// Tahmin kontrolü ve veritabanına kaydetme
app.post('/guess', async (req, res) => {
    const { guess } = req.body;
    const number = Math.round(Math.random() * 100);

    let result = '';
    if (guess < number) {
        result = 'Daha büyük bir sayı giriniz.';
    } else if (guess > number) {
        result = 'Daha küçük bir sayı giriniz.';
    } else {
        result = 'Tebrikler bildiniz.';
    }

    // Tahmini veritabanına kaydet
    try {
        const newGuess = await Guess.create({ number, guess, result });
        res.json({ number, guess, result });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Tahminlerin listesini alma
app.get('/guesses', async (req, res) => {
    try {
        const guesses = await Guess.findAll();
        res.json(guesses);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
