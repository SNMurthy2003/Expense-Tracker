import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch all expenses
export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find({}).sort({ date: -1 });

    // Always return consistent structure with data array
    return NextResponse.json({
      success: true,
      data: expenses
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching expenses:", error);

    // Always return empty array to prevent frontend crashes
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch expenses",
      data: []
    }, { status: 500 });
  }
}

// POST handler to add expense
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, amount, category, description, date, teamName } = body;

    // Validation - ensure required fields
    if (!title || !amount || !category) {
      return NextResponse.json({
        success: false,
        error: "Please provide title, amount, and category"
      }, { status: 400 });
    }

    // Create new expense
    const expense = new Expense({
      title,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
      teamName: teamName || "Default Team"
    });

    const savedExpense = await expense.save();

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      data: savedExpense
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding expense:", error);

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to add expense"
    }, { status: 500 });
  }
}
