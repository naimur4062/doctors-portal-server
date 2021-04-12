const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnj3g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('err', err);
  const appointmentsCollection = client.db("doctorsPortal").collection("appointments");
   
  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      appointmentsCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/appointmentByDate', (req, res) => {
      const date = req.body;
      console.log(date.date);
      appointmentsCollection.find({date: date.date})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.get('/appointments', (req, res) => {
      appointmentsCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello, i am working!')
})

app.listen(process.env.PORT || port)