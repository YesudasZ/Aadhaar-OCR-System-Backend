# Aadhaar OCR System Backend Server

This project is an Express.js-based backend server that processes Aadhaar card images (both front and back), extracts relevant information such as name, Aadhaar number, date of birth, gender, and address using Google Cloud Vision OCR, and returns the extracted details in JSON format. The server also includes Aadhaar card verification to ensure the uploaded images are indeed Aadhaar cards.

## Features

- **OCR Processing**: Extracts text from Aadhaar card images using Google Cloud Vision OCR API.
- **Aadhaar Card Details Extraction**: Extracts key Aadhaar card details such as name, Aadhaar number, date of birth, gender, and address.
- **Image Verification**: Verifies if the uploaded images are Aadhaar cards by checking for keywords like "government", "india", "aadhaar", and "uid".
- **Error Handling**: Centralized error handling for API failures and incorrect routes.

## Requirements

- Node.js (v12 or later)
- A Google Cloud account with access to the Vision API
- A `google-cloud-credentials.json` file for Vision API authentication

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repository/aadhaar-ocr-backend.git
cd aadhaar-ocr-backend
```

### 2. Install Dependencies

Run the following command to install the required Node.js packages:

```bash
npm install
```

### 3. Google Cloud Vision API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or use an existing one).
3. Enable the **Vision API** for your project.
4. Generate a **service account key** and download the JSON key file.
5. Place the downloaded key file in the root directory of the project and name it `google-cloud-credentials.json`.

### 4. Environment Variables (Optional)

You can change the port the server runs on by setting the `PORT` environment variable:

```bash
PORT=5000
```

### 5. Running the Server

To start the server, run:

```bash
npm start
```

The server will run on the specified port or default to port 5000.

### 6. API Endpoints

#### POST `/api/ocr`

This endpoint accepts Aadhaar card images (both front and back), performs OCR using Google Cloud Vision, verifies if the images belong to an Aadhaar card, and returns the extracted details.

##### Request Body (JSON):

- `frontImage`: The base64-encoded front image of the Aadhaar card.
- `backImage`: The base64-encoded back image of the Aadhaar card.

##### Example Request:

```json
{
  "frontImage": "data:image/jpeg;base64,...",
  "backImage": "data:image/jpeg;base64,..."
}
```

##### Example Response (Success):

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "aadhaarNumber": "1234 5678 9101",
    "dob": "01/01/1990",
    "gender": "MALE",
    "address": "123 Street Name, City, State.",
    "pincode": "123456"
  }
}
```

##### Example Response (Failure - Invalid Aadhaar Card):

```json
{
  "success": false,
  "error": "Uploaded images do not appear to be Aadhaar card images. Please upload valid Aadhaar card images."
}
```

### 7. Error Handling

If any error occurs during the OCR process or if an invalid route is requested, the server will return an appropriate error message. 

- **404 Not Found**: If an invalid route is requested, a `404` error will be returned with the message:

    ```json
    {
      "success": false,
      "error": "Route not found"
    }
    ```

- **500 Internal Server Error**: If something goes wrong while processing the request (e.g., during OCR processing), a `500` error will be returned with a message:

    ```json
    {
      "success": false,
      "error": "Error processing OCR request"
    }
    ```

## Code Structure

### `server.js`

- Sets up the Express server and configures middleware.
- Initializes the Google Cloud Vision API client.
- Routes all OCR requests to `/api/ocr`.

### `routes/ocrRoutes.js`

- Contains the logic to handle the `/api/ocr` route.
- Processes the base64-encoded images, verifies them, and extracts Aadhaar details.

### `utils/ocrUtils.js`

- Contains utility functions:
  - **`processBase64Image`**: Converts base64-encoded image data to a Buffer.
  - **`extractAadhaarDetails`**: Extracts relevant details (name, Aadhaar number, etc.) from the OCR text.
  - **`verifyAadhaarCard`**: Verifies if the uploaded images are Aadhaar cards by checking for specific keywords.

### `middleware/errorHandler.js`

- Centralized error-handling middleware to catch and handle any server errors.

### `middleware/notFound.js`

- Middleware to handle 404 errors for any undefined routes.

## Testing

To test the OCR API, you can use a tool like [Postman](https://www.postman.com/) to send a `POST` request to `/api/ocr` with base64-encoded images.

## Future Improvements

- Add unit tests to validate individual utility functions.
- Implement rate-limiting to prevent abuse of the OCR API.
- Support for additional card types and verification.

## License

This project is licensed under the MIT License.
```

---

### Document Overview:

- **Project Description**: Provides an overview of the project's purpose and features.
- **Setup Instructions**: Detailed steps to clone the repository, install dependencies, set up Google Cloud Vision, and run the server.
- **API Endpoints**: Documents the API endpoint used for OCR processing, including request and response examples.
- **Error Handling**: Explains how errors are handled and the possible error responses.
- **Code Structure**: Describes the role of each module (server, routes, utilities, and middleware) in the project.
- **Testing**: Instructions for testing the API using Postman.
- **Future Improvements**: A section for potential future enhancements.
