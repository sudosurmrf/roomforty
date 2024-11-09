require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to log route access
app.use((req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.path}`);
    next();
});

// Ensure the dist/uploads directory exists
const uploadsDir = path.join(__dirname, 'dist', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('dist/uploads directory created.');
}

// Endpoint to receive MMS from Twilio
app.post('/mms', async (req, res) => {
    const { From, Body } = req.body;
    const mediaUrl = req.body['MediaUrl0'];

    if (mediaUrl) {
        try {
            // Fetch the media using the native fetch API
            const response = await fetch(mediaUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch media: ${response.statusText}`);
            }

            const filename = `dist/uploads/${Date.now()}-${From.replace('+', '')}.jpg`;
            const fileStream = fs.createWriteStream(filename);

            // Pipe the response body directly to the file system
            response.body.pipe(fileStream);

            response.body.on('end', () => {
                console.log(`Saved media: ${filename}`);
                res.status(200).send('File received and saved');
            });

            response.body.on('error', (err) => {
                console.error('Error saving media:', err);
                res.status(500).send('Failed to save media');
            });
        } catch (error) {
            console.error('Error downloading media:', error);
            res.status(500).send('Error processing the media');
        }
    } else {
        res.status(400).send('No media found in the request');
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
