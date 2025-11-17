import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Income from '@/lib/models/Income';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch all income
export async function GET() {
  try {
    await connectDB();

    const incomes = await Income.find({}).sort({ date: -1 });

    // Always return consistent structure with data array
    return NextResponse.json({
      success: true,
      data: incomes
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching incomes:", error);

    // Always return empty array to prevent frontend crashes
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch incomes",
      data: []
    }, { status: 500 });
  }
}

// POST handler to add income
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

    // Create new income
    const income = new Income({
      title,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
      teamName: teamName || "Default Team"
    });

    const savedIncome = await income.save();

    return NextResponse.json({
      success: true,
      message: "Income added successfully",
      data: savedIncome
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding income:", error);

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to add income"
    }, { status: 500 });
  }
}
