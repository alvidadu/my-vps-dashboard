const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ১. প্রথমে এই রুটটি দেখা যাবে (লগইন পেজ)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// ২. লগইন বাটনে ক্লিক করলে পাসওয়ার্ড চেক হবে
app.post('/login', (req, res) => {
    const password = req.body.password;
    if (password === 'admin') { // আপনি চাইলে admin পরিবর্তন করে নিজের পাসওয়ার্ড দিতে পারেন
        res.sendFile(path.join(__dirname, 'public/dashboard.html'));
    } else {
        res.send("পাসওয়ার্ড ভুল! আবার চেষ্টা করুন।");
    }
});

// ৩. সিস্টেম স্ট্যাটাসের জন্য ডামি ডাটা
app.get('/system_stats', (req, res) => {
    res.json({ cpu: '30.4', ram: '54.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));