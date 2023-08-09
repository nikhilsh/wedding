const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let guests = {
    "John Doe": {
        "hasResponded": false,
        "isAttending": false,
        "family": ["Jane Doe", "Sam Doe"],
        "dietaryPreference": "None"
    }
    // ... Add more guests as needed
};

app.use(bodyParser.json());
app.use(express.static('public'));  // Assuming your front-end files are in a 'public' directory

app.get('/guests', (req, res) => {
    res.json(guests);
});

app.post('/rsvp', (req, res) => {
    // Handle the RSVP data here, update the `guests` object
    // ...

    res.json({ message: 'RSVP submitted successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
