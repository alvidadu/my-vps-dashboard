const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer'); // ফাইল আপলোড হ্যান্ডেল করার জন্য
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// হোম পেজ (লগইন)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// লগইন চেক
app.post('/login', (req, res) => {
    const password = req.body.password;
    if (password === 'admin') {
        res.sendFile(path.join(__dirname, 'public/dashboard.html'));
    } else {
        res.send("ভুল পাসওয়ার্ড! <a href='/'>আবার চেষ্টা করুন</a>");
    }
});

// নতুন সার্ভার তৈরি করার রুট (আপনার এররটি এখানে ছিল)
app.post('/create_server', upload.single('file'), (req, res) => {
    const serverName = req.body.server_name;
    const startCommand = req.body.start_command;
    
    console.log(`সার্ভারের নাম: ${serverName}`);
    console.log(`কমান্ড: ${startCommand}`);

    // এখানে সার্ভার ক্রিয়েট করার মেসেজ দেখাবে
    res.send(`
        <div style="background:#000; color:#00ff00; padding:20px; font-family:monospace; height:100vh;">
            <h2>[SUCCESS] সার্ভার "${serverName}" সফলভাবে তৈরি হয়েছে!</h2>
            <p>আপনার দেওয়া কমান্ড: <b>${startCommand}</b> প্রসেস করা হচ্ছে...</p>
            <hr>
            <p>দ্রষ্টব্য: এটি একটি ডেমো প্যানেল। Render-এর ফ্রি টায়ারে সরাসরি অন্য ফাইল রান করা সীমাবদ্ধ।</p>
            <a href="/" style="color:#fff; text-decoration:none; border:1px solid #fff; padding:5px 10px;">ড্যাশবোর্ডে ফিরে যান</a>
        </div>
    `);
});

// সিস্টেম স্ট্যাটাস ডেটা
app.get('/system_stats', (req, res) => {
    res.json({ 
        cpu: (Math.random() * 20 + 10).toFixed(1), 
        ram: (Math.random() * 30 + 40).toFixed(1) 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
