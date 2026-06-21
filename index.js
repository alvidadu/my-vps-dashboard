const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// লগইন চেক
app.post('/login', (req, res) => {
    const password = req.body.password;
    if (password === 'admin') {
        res.sendFile(path.join(__dirname, 'public/dashboard.html'));
    } else {
        res.send("Invalid Password! <a href='/'>Try again</a>");
    }
});

// হোম পেজ (লগইন)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// সিস্টেম স্ট্যাটাস ডামি ডেটা (আপনার ড্যাশবোর্ডের জন্য)
app.get('/system_stats', (req, res) => {
    res.json({ cpu: (Math.random() * 100).toFixed(1), ram: (Math.random() * 100).toFixed(1) });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});