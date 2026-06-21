const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

// ফাইল আপলোড কনফিগারেশন
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

let servers = {}; // চলমান সার্ভারগুলো ট্র্যাক করার জন্য

// হোম ও লগইন
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));

app.post('/login', (req, res) => {
    if (req.body.password === 'admin') res.sendFile(path.join(__dirname, 'public/dashboard.html'));
    else res.send("Wrong Password");
});

// ভিডিওর মতো সার্ভার ক্রিয়েট ও রান করা
app.post('/create_server', upload.single('file'), (req, res) => {
    const { server_name, start_command } = req.body;
    const fileName = req.file ? req.file.originalname : '';

    const id = Date.now().toString();
    servers[id] = {
        name: server_name,
        command: start_command,
        file: fileName,
        status: 'running',
        logs: '',
        process: null
    };

    // কমান্ড রান করা (যেমন: python bot.py)
    const cmdArgs = start_command.split(' ');
    const child = spawn(cmdArgs[0], cmdArgs.slice(1), { cwd: './uploads/' });

    servers[id].process = child;

    child.stdout.on('data', (data) => {
        servers[id].logs += data.toString();
    });

    child.stderr.on('data', (data) => {
        servers[id].logs += data.toString();
    });

    res.redirect('/'); // ভিডিওর মতো ড্যাশবোর্ডে ফেরত যাবে
});

// লাইভ লগ দেখানোর জন্য API
app.get('/get_logs/:id', (req, res) => {
    const id = req.params.id; // ডেমো হিসেবে আমরা সব লগ পাঠাচ্ছি
    res.json({ logs: servers[id] ? servers[id].logs : "No logs available..." });
});

// সিস্টেম স্ট্যাটাস
app.get('/system_stats', (req, res) => {
    res.json({ cpu: (Math.random() * 10 + 5).toFixed(1), ram: (Math.random() * 20 + 30).toFixed(1) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
