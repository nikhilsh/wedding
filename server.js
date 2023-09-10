import express from 'express';
import bodyParser from 'body-parser';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fetch from 'node-fetch'

const app = express();
const PORT = 3000;

const file = './db.json'
const adapter = new JSONFile(file)
const defaultData = {
    "families": [
      {
        "members": ["John Doe", "Jane Doe", "Sam Doe"],
        "hasResponded": false,
        "attendingMembers": [],
        "dietaryPreferences": {
          "John Doe": "None",
          "Jane Doe": "None",
          "Sam Doe": "None"
        }
      }
    ]
  }
const db = new Low(adapter, { guests: [] })

app.use(bodyParser.json());
app.use(express.static('public')); 

app.get('/guests', async (req, res) => {
    await db.read()
    const guests = db.data
    res.json(guests);
});

app.post('/rsvp', (req, res) => {
    const rsvpData = req.body;
    const action = 'https://script.google.com/macros/s/AKfycbxc0dlIMUwSM4I3jsdokzr8vDqzbl7scxZx7rp4lEh-n-MzbZvPAGaM0_ZWd7-x9fMb/exec'

    // await db.read()
    for (let index in rsvpData) {
      let person = rsvpData[index]
      let data = {
        'Name': person['name'],
        'isAttending': person['isAttending'],
        'dietaryPreference': person['dietaryPreference'],
        'hasResponded': true
      }
      console.log('data: ' + JSON.stringify(data))


      fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    }
    res.json({ message: 'RSVP submitted successfully!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

