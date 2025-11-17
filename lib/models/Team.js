import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
  {
    teamName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
