
import express, { Router } from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fetch from 'node-fetch'

const api = express();

const router = Router();
const file = './db.json'
const adapter = new JSONFile(file)
const db = new Low(adapter, { guests: [] })

router.get('/guests', async (req, res) => {
    await db.read()
    const guests = {
        "families": [
          {
            "members": ["John Doe", "Jane Doe", "Sam Doe"],
            "hasResponded": false,
            "attendingMembers": [],
            "dietaryPreferences": {
              "John Doe": "None",
              "Jane Doe": "Veg",
              "Sam Doe": "Halal"
            }
          }
        ]
      }
      
    res.json(guests);
});

router.post('/rsvp', (req, res) => {
    const rsvpData = req.body;
    const action = process.env.ACTION_URL
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

api.use('/api/', router);

export const handler = serverless(api);
