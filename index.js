const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3500

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://assignment10:PQx3GjaXZhiw5jL4@cluster0.wpjlndq.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// ===== POST /issues endpoint =====
app.post("/issues", async (req, res) => {
  try {
    const issue = req.body;
    const collection = client.db("reporting_portal").collection("issues");
    const result = await collection.insertOne(issue);

    res.status(201).json({
      success: true,
      message: "Issue added successfully",
      issueId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add issue" });
  }
});
//GET /issues //
app.get("/issues", async (req, res) => {
  try {
    const collection = client.db("reporting_portal").collection("issues");
    const issues = await collection.find({}).toArray();
    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch issues" });
  }
});





// Root test route
app.get('/', (req, res) => {
  res.send('Server is running fine');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
