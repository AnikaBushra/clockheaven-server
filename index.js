const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z11va.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('clockShop');
        const clockCollection = database.collection('clocks');
        const userCollection = database.collection('user');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        // get clocks api 
        app.get('/clocks', async (req, res) => {
            const cursor = clockCollection.find({});
            const clock = await cursor.toArray();
            res.send(clock);
        });
        // get signle clock api 
        app.get('/clocks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const clock = await clockCollection.findOne(query);
            res.json(clock);
        });
        // Post orders 
        app.post('/orders', async (req, res) => {
            const datas = req.body;
            const result = await userCollection.insertOne(datas);
            res.json(result);
        });
        // get Orders 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = userCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });
        // get One order ...
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await userCollection.findOne(query);
            res.json(order);
        });
        // delete orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.json(result);

        })
        // Post reviews 
        app.post('/reviews', async (req, res) => {
            const datas = req.body;
            const result = await reviewCollection.insertOne(datas);
            res.json(result);
        });
        // get reviews ...
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        //post users
        app.post('/users', async (req, res) => {
            const userdata = req.body;
            const result = await usersCollection.insertOne(userdata);
            res.json(result);
        });
        // update users 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})