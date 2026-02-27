const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to messages JSON
const messagesFilePath = path.join(__dirname, 'messages.json');

// Initialize messages.json if it doesn't exist
if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([]));
}

// POST endpoint to handle form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    try {
        // Read existing messages
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        const messages = JSON.parse(data);

        // Add new message
        messages.push(newMessage);

        // Save updated messages
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

        res.status(200).json({ success: true, message: 'Message received successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal server error while saving the message.' });
    }
});

// GET endpoint to view messages (for testing)
app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Could not read messages.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
