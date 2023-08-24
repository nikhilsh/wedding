import express from 'express';
import bodyParser from 'body-parser';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

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
  
const db = new Low(adapter, defaultData)

app.use(bodyParser.json());
app.use(express.static('public')); 

app.get('/guests', (req, res) => {
    db.read('guests')
    const guests = db.data
    console.log(guests)
    res.json(guests);
});

app.post('/rsvp', (req, res) => {
    const rsvpData = req.body;

    for (let name in rsvpData) {
        if (db.get('guests').has(name).value()) {
            const { isAttending, dietaryPreference } = rsvpData[name];
            console.log(name, isAttending, dietaryPreference);

            db.get('guests')
              .set(`${name}.hasResponded`, true)
              .set(`${name}.isAttending`, isAttending)
              .set(`${name}.dietaryPreference`, dietaryPreference)
              .write();
        }
    }

    res.json({ message: 'RSVP submitted successfully!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
