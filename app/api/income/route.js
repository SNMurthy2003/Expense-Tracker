import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Income from '@/lib/models/Income';

// GET handler to fetch all income
export async function GET(request) {
  try {
    await connectDB();

    const incomes = await Income.find({}).sort({ date: -1 });
    console.log("✅ Fetched incomes:", incomes.length);

    return NextResponse.json({
      success: true,
      count: incomes.length,
      data: incomes
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching incomes:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}

// POST handler to add income
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Received income data:", body);

    const { title, amount, category, description, date, teamName } = body;

    // Validation
    if (!title || !amount || !category) {
      return NextResponse.json({
        success: false,
        message: "Please provide title, amount, and category"
      }, { status: 400 });
    }

    const income = new Income({
      title,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
      teamName: teamName || "Default Team"
    });

    const savedIncome = await income.save();
    console.log("✅ Income saved successfully:", savedIncome);

    return NextResponse.json({
      success: true,
      message: "Income added successfully",
      data: savedIncome
    }, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding income:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
