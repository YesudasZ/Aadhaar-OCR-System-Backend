const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const vision = require('@google-cloud/vision');
const ocrRoutes = require('./routes/ocrRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, 'google-cloud-credentials.json'),
});

app.use('/api/ocr', ocrRoutes(client));  

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




