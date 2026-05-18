const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Prompt = require("./models/Prompt");

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const prompts = await Prompt.find({});
    console.log("Total prompts in DB:", prompts.length);
    console.log(prompts.map(p => ({
      title: p.title,
      status: p.status,
      userId: p.userId,
      category: p.category
    })));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
