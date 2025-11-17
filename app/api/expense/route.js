import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch all expenses
export async function GET(request) {
  try {
    await connectDB();

    const expenses = await Expense.find({}).sort({ date: -1 });
    console.log("✅ Fetched expenses:", expenses.length);

    return NextResponse.json({
      success: true,
      count: expenses.length,
      data: expenses
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}

// POST handler to add expense
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("=== EXPENSE DEBUG START ===");
    console.log("Received expense data:", body);
    console.log("=== EXPENSE DEBUG END ===");

    const { title, amount, category, description, date, teamName } = body;

    // Log each field
    console.log("Extracted fields:");
    console.log("- title:", title);
    console.log("- amount:", amount);
    console.log("- category:", category);
    console.log("- description:", description);
    console.log("- date:", date);
    console.log("- teamName:", teamName);

    // Validation
    if (!title || !amount || !category) {
      console.log("❌ Validation failed");
      return NextResponse.json({
        success: false,
        message: "Please provide title, amount, and category",
        received: { title, amount, category }
      }, { status: 400 });
    }

    const expense = new Expense({
      title,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
      teamName: teamName || "Default Team"
    });

    console.log("Attempting to save expense:", expense);
    const savedExpense = await expense.save();
    console.log("✅ Expense saved successfully:", savedExpense);

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      data: savedExpense
    }, { status: 201 });
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
