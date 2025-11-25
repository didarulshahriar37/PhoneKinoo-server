const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.spgu1hn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();

        const db = client.db("phone_kinoo");
        const phonesCollection = db.collection("phones");

        app.get("/latest-phones", async(req, res) => {
            const cursor = phonesCollection.find().sort({publishedAt: -1}).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/phones", async(req, res) => {
            const cursor = phonesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.error(error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('PhoneKinoo Server is Running');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})