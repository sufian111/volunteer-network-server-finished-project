const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri =
  "mongodb+srv://admin:admin@cluster0.kewtx.mongodb.net/Volunteer-network?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db("Volunteer-network")
    .collection("allServices");

  const orderCollection = client.db("Volunteer-network").collection("allOrder");
  //   get the all order by api
  app.get("/order", (req, res) => {
    orderCollection.find({}).toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  //   get all the service by api
  app.get("/service", (req, res) => {
    serviceCollection.find({}).toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  //   set a service

  app.post("/addService", (req, res) => {
    const service = req.body;

    serviceCollection.insertOne(service, (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ status: "document added" });
      }
    });
  });

  //   register a order

  app.post("/addOrder", (req, res) => {
    const order = req.body;

    orderCollection.insertOne(order, (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ status: "document added" });
      }
    });
  });

  console.log("conect i");
});

app.listen(process.env.PORT || port);
