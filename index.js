const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l85wmee.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("ultraNet").collection("services");
    const allServiceCollection = client
      .db("ultraNet")
      .collection("allServices");
    const orderCollection = client.db("ultraNet").collection("orders");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/all-services", async (req, res) => {
      const query = {};
      const cursor = allServiceCollection.find(query);
      const allServices = await cursor.toArray();
      res.send(allServices);
    });

    app.get("/all-services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await allServiceCollection.findOne(query);
      res.send(service);
    });

    // orders api start from here
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
  } finally {
    // nothing to do here
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("ultra net server is running");
});

app.listen(port, () => {
  console.log(`ultra net server is running port: ${port}`);
});
