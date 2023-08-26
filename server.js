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
  
const db = new Low(adapter, defaultData)

app.use(bodyParser.json());
app.use(express.static('public')); 

app.get('/guests', (req, res) => {
    db.read('guests')
    const guests = db.data
    res.json(guests);
});



app.post('/rsvp', (req, res) => {
    const rsvpData = req.body;
    for (let index in rsvpData) {
      let person = rsvpData[index]
      let data = {
        'Name': person['name'],
        'isAttending': person['isAttending'],
        'dietaryPreference': person['dietaryPreference'],
        'hasResponded': true
      }
    
      const action = 'https://script.google.com/macros/s/AKfycbxuuzMLLszKV1Ms3PNc4VZzQMiAivjVLhwl8kj7gwgl2jfQgoKO6BA6iT_KvFmtNUZ8/exec'
      
      fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
  }
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
