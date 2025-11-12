// server.js
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 3500;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===
const uri =
  "mongodb+srv://assignment10:PQx3GjaXZhiw5jL4@cluster0.wpjlndq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// === Connect to DB ===
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
run().catch(console.dir);

// === Collection ===
const collection = client.db("reporting_portal").collection("issues");



// ✅ Root route (Test)
app.get("/", (req, res) => {
  res.send(" Server is running fine!");
});

// ✅ POST - Add new issue
app.post("/issues", async (req, res) => {
  try {
    const issue = req.body;
    const result = await collection.insertOne(issue);

    res.status(201).json({
      success: true,
      message: "🟢 Issue added successfully!",
      issueId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /issues error:", error);
    res.status(500).json({ success: false, message: "Failed to add issue" });
  }
});

// ✅ GET - All issues
app.get("/issues", async (req, res) => {
  try {
    const issues = await collection.find({}).toArray();
    res.json({ success: true, data: issues });
  } catch (error) {
    console.error("GET /issues error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch issues" });
  }
});

// ✅ GET - Single issue by ID
app.get("/issues/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const issue = await collection.findOne({ _id: new ObjectId(id) });

    if (!issue)
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });

    res.json({ success: true, data: issue });
  } catch (error) {
    console.error("GET /issues/:id error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch issue details" });
  }
});

// ✅ Server start
app.listen(port, () => {
  console.log(`🌍 Server is running on http://localhost:${port}`);
});
