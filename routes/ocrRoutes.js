const express = require('express');
const { processBase64Image, extractAadhaarDetails, verifyAadhaarCard } = require('../utils/ocrUtils');

const router = express.Router();

module.exports = (client) => {
    router.post('/', async (req, res, next) => {
        try {
            const { frontImage, backImage } = req.body;

            if (!frontImage || !backImage) {
                return res.status(400).json({
                    success: false,
                    error: 'Both front and back images are required'
                });
            }

            const frontBuffer = processBase64Image(frontImage);
            const [frontResult] = await client.textDetection(frontBuffer);
            const frontText = frontResult.fullTextAnnotation.text;

            const backBuffer = processBase64Image(backImage);
            const [backResult] = await client.textDetection(backBuffer);
            const backText = backResult.fullTextAnnotation.text;


            if (!verifyAadhaarCard(frontText, backText)) {
                return res.status(400).json({
                    success: false,
                    error: 'Please upload valid Aadhaar card images.'
                });
            }

            const extractedDetails = extractAadhaarDetails(frontText, backText);
console.log("Testing", extractedDetails);

            res.json({
                success: true,
                data: extractedDetails
            });

        } catch (error) {
            next(error);
        }
    });

    return router;
};
