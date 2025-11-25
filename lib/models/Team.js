import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
  {
    teamName: { type: String, required: true, unique: true },
    createdBy: {
      type: String,  // Firebase UID
      required: true,
      index: true,
    },
    members: [{
      type: String,  // Array of Firebase UIDs
    }],
  },
  { timestamps: true }
);

// Index for efficient queries
teamSchema.index({ createdBy: 1 });
teamSchema.index({ members: 1 });

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
