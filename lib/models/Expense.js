import mongoose from "mongoose";

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Groceries', 'Other'],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now
    },
    teamName: {
      type: String,
      default: "Default Team",
      trim: true,
    },
    receiptImage: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ teamName: 1 });

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);