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
const db = new Low(adapter, { guests: [] })

app.use(bodyParser.json());
app.use(express.static('public')); 

app.get('/guests', async (req, res) => {
    await db.read()
    const guests = db.data
    res.json(guests);
});

app.post('/rsvp', async (req, res) => {
    const rsvpData = req.body;

    await db.read()
    for (let index in rsvpData) {
      let person = rsvpData[index]
      let data = {
        'Name': person['name'],
        'isAttending': person['isAttending'],
        'dietaryPreference': person['dietaryPreference'],
        'hasResponded': true
      }
      console.log('data: ' + JSON.stringify(data))
      const guests = db.data
      // console.log("rsvp" + guests)
      // if (guests.includes(name)) {
      //   const { isAttending, dietaryPreference } = rsvpData[name]
      //   console.log(name, isAttending, dietaryPreference)
      //   db.data.guests.push({
      //     name: rsvpData.name,
      //     hasResponded: true,
      //     isAttending: isAttending,
      //     dietaryPreference: dietaryPreference
      //   })
      // }
    }
    res.json({ message: 'RSVP submitted successfully!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
