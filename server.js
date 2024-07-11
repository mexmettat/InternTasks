const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let secretNumber = Math.round(Math.random() * 100);
let attempts = 0;
const maxAttempts = 10;

app.use(bodyParser.json());
app.use(cors());

app.post('/guess', (req, res) => {
    const { guess } = req.body;
    attempts++;

    if (attempts > maxAttempts) {
        return res.json({
            message: "Hakkınız kalmadı. Tutulan sayı: " + secretNumber,
            success: false,
            reset: true
        });
    }

    if (guess < secretNumber) {
        res.json({
            message: "Daha büyük bir sayı giriniz.",
            success: false,
            attemptsLeft: maxAttempts - attempts
        });
    } else if (guess > secretNumber) {
        res.json({
            message: "Daha küçük bir sayı giriniz.",
            success: false,
            attemptsLeft: maxAttempts - attempts
        });
    } else {
        res.json({
            message: "Tebrikler bildiniz! Tuttuğum sayı: " + secretNumber,
            success: true,
            attemptsLeft: maxAttempts - attempts
        });
    }
});

app.post('/reset', (req, res) => {
    secretNumber = Math.round(Math.random() * 100);
    attempts = 0;
    res.json({
        message: "Oyun sıfırlandı!",
        success: true
    });
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
