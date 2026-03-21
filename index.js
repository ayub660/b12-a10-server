require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3500;

// === Middleware ===
app.use(cors());
app.use(express.json());


// Cleancity
// INBPBRdxDs30CpGF

//const uri = "mongodb+srv://Cleancity:<db_password>@cleancity.daet6od.mongodb.net/?appName=cleancity";

// === MongoDB Connection ===
// const uri =
//   "mongodb+srv://assignment10:PQx3GjaXZhiw5jL4@cluster0.wpjlndq.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cleancity.daet6od.mongodb.net/reporting_portal?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// === Connect to MongoDB ===
async function run() {
  try {
    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log(" Connected to MongoDB successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
  }
}
run().catch(console.dir);

// === Collections ===
const issueCollection = client.db("reporting_portal").collection("issues");
const contributionCollection = client.db("reporting_portal").collection("contributions");

// === Routes ===

// Root route
app.get("/", (req, res) => {
  res.send(" Community Issue Reporting Server is running fine!");
});

//  POST - Add new issue
app.post("/issues", async (req, res) => {
  try {
    const issue = req.body;
    issue.status = "Ongoing"; // default status
    issue.date = new Date().toISOString();
    const result = await issueCollection.insertOne(issue);
    res.status(201).json({
      success: true,
      message: "📝 Issue added successfully!",
      issueId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /issues error:", error);
    res.status(500).json({ success: false, message: "Failed to add issue" });
  }
});

//  GET - Fetch all issues
app.get("/issues", async (req, res) => {
  try {
    const issues = await issueCollection.find({}).toArray();
    res.json({ success: true, data: issues });
  } catch (error) {
    console.error("GET /issues error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch issues" });
  }
});

//  GET - Fetch single issue by ID
app.get("/issues/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const issue = await issueCollection.findOne({ _id: new ObjectId(id) });
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });
    res.json({ success: true, data: issue });
  } catch (error) {
    console.error("GET /issues/:id error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch issue details" });
  }
});

//  PUT - Update an issue
app.put("/issues/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await issueCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ success: false, message: "Issue not found" });
    res.json({ success: true, message: "Issue updated successfully" });
  } catch (error) {
    console.error("PUT /issues/:id error:", error);
    res.status(500).json({ success: false, message: "Failed to update issue" });
  }
});

//  DELETE - Delete an issue
app.delete("/issues/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await issueCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, message: "Issue not found" });
    res.json({ success: true, message: "Issue deleted successfully" });
  } catch (err) {
    console.error("DELETE /issues/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to delete issue" });
  }
});

//  POST - Add contribution (Payment)
app.post("/contributions", async (req, res) => {
  try {
    const contribution = req.body;
    contribution.date = new Date().toISOString();
    const result = await contributionCollection.insertOne(contribution);
    res.status(201).json({
      success: true,
      message: "💰 Contribution added successfully!",
      contributionId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /contributions error:", error);
    res.status(500).json({ success: false, message: "Failed to add contribution" });
  }
});

//  GET - User's issues
app.get("/my-issues/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const issues = await issueCollection.find({ email }).toArray();
    res.json({ success: true, data: issues });
  } catch (error) {
    console.error("GET /my-issues/:email error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user's issues" });
  }
});

//  GET - User's contributions
app.get("/my-contributions/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const contributions = await contributionCollection.find({ email }).toArray();
    res.json({ success: true, data: contributions });
  } catch (error) {
    console.error("GET /my-contributions/:email error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contributions" });
  }
});

// === Start server ===
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
