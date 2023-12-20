const express = require('express');
const axios = require('axios');
const multer = require('multer');
const app = express();
const B2 = require('backblaze-b2');
const uploadB2 = require('./uploadB2');

const upload = multer({ storage: multer.memoryStorage() });

app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});

// Endpoint to receive file from frontend
app.post('/upload', upload.single('file'), uploadB2, (req, res) => {
   const uploadData = req.locals;
   res.send(uploadData);
});

const PORT = 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
