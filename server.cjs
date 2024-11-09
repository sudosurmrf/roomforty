require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const imghash = require('imghash');
const sizeOf = require('image-size');

const app = express();
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the 'uploads' directory statically
app.use('/uploads', express.static(path.join(__dirname, 'dist', 'uploads')));

// Middleware to log route access
app.use((req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.path}`);
    next();
});

// Cache setup
// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'dist', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('dist/uploads directory created.');
}

const cacheFilePath = path.join(__dirname, 'hashCache.json');
let hashCache = {};
if (fs.existsSync(cacheFilePath)) {
    hashCache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
}
async function getImageHash(filePath) {
    const fileName = path.basename(filePath);
    if (hashCache[fileName]) {
        return hashCache[fileName];
    }
    try {
        const hash = await imghash.hash(filePath, 16);
        hashCache[fileName] = hash;
        fs.writeFileSync(cacheFilePath, JSON.stringify(hashCache, null, 2));
        return hash;
    } catch (error) {
        console.error(`Error hashing image ${filePath}:`, error);
        return null;
    }
}

// Function to compute Hamming distance
function hammingDistance(hash1, hash2) {
    let distance = 0;
    const len = Math.min(hash1.length, hash2.length);
    for (let i = 0; i < len; i++) {
        if (hash1[i] !== hash2[i]) {
            distance++;
        }
    }
    distance += Math.abs(hash1.length - hash2.length);
    return distance;
}

app.get('/api/photos', async (req, res) => {
    const uploadsDir = path.join(__dirname, 'dist', 'uploads');

    fs.readdir(uploadsDir, async (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            return res.status(500).json({ error: 'Error loading photos' });
        }

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        const imageDataPromises = imageFiles.map(async file => {
            const filePath = path.join(uploadsDir, file);
            const hash = await getImageHash(filePath);
            return { file, hash };
        });

        const imageData = await Promise.all(imageDataPromises);

        const validImages = imageData.filter(data => data.hash !== null);

        if (validImages.length === 0) {
            return res.json([]);
        }

        // Select a reference image (e.g., the first image)
        const referenceImage = validImages[0];

        // Compute Hamming distances
        validImages.forEach(data => {
            data.distance = hammingDistance(referenceImage.hash, data.hash);
        });

        // Sort images by distance (similarity)
        validImages.sort((a, b) => a.distance - b.distance);

        // Map image data to response format
        const photos = validImages.map(data => ({
            url: `/uploads/${data.file}`,
            caption: `Distance: ${data.distance}`,
            distance: data.distance,
        }));

        res.json(photos);
    });
});

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
// Serve React App for All Other GET Requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Something broke!');
});


app.listen(3001, () => {
    console.log('Server running on 3001');
});
