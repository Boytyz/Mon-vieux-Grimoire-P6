import mongoose from "mongoose";

// Schema du user
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
});

export default mongoose.model("User", userSchema);
