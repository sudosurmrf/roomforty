require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to log route access
app.use((req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.path}`);
    next();
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'dist', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('dist/uploads directory created.');
}

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'dist', 'index.html');
    console.log('Sending file:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status || 500).send('Error loading the page.');
        }
    });
});

// Endpoint to receive MMS from Twilio
app.post('/mms', async (req, res) => {
    const { From, Body } = req.body;
    const mediaUrl = req.body['MediaUrl0'];

    if (mediaUrl) {
        try {
            // Fetch the media using the native fetch API
            const response = await fetch(mediaUrl, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch media: ${response.statusText}`);
            }

            // Read the response as a buffer
            // Read the response as an array buffer and convert it to a Node.js buffer
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);


            const filename = `dist/uploads/${Date.now()}-${From.replace('+', '')}.jpg`;

            // Write the buffer to a file
            fs.writeFileSync(filename, buffer);
            console.log(`Saved media: ${filename}`);
            res.status(200).send('File received and saved');
        } catch (error) {
            console.error('Error downloading media:', error);
            res.status(500).send('Error processing the media');
        }
    } else {
        res.status(400).send('No media found in the request');
    }
});

app.use((req, res, next) => {
    res.status(404).send('Sorry, we could not find that page.');
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Something broke!');
});


app.listen(3001, () => {
    console.log('Server running on 3001');
});
