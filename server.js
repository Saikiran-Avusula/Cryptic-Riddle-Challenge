const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Serve static files (HTML, JS)
app.use(express.static(path.join(__dirname, 'public')));

let encryptionKey = "mySecretKey"; // Static key for demo
let encryptedText = "";

// **GET /encrypt - Generate encrypted text**
app.get('/encrypt', (req, res) => {
    const textToEncrypt = "Hello, this is a secret message!";
    encryptedText = Buffer.from(textToEncrypt).toString('base64'); // Base64 Encoding
    res.json({ key: encryptionKey, encrypted_text: encryptedText });
});

// **POST /verify - Verify the decrypted text**
app.post('/verify', (req, res) => {
    const { decrypted_text, email, phone_number, name, user_submitted_code } = req.body;

    if (!decrypted_text || !email || !phone_number || !name || !user_submitted_code) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const expectedText = Buffer.from(encryptedText, 'base64').toString();
    
    if (decrypted_text === expectedText) {
        res.json({ message: "Verification successful! User details saved." });
    } else {
        res.status(400).json({ message: "Verification failed! Decrypted text is incorrect." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
