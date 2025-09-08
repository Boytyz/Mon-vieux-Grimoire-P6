import mongoose from "mongoose";

// Schema du livre
const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

export default mongoose.model("Book", bookSchema);
