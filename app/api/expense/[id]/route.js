import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// DELETE handler to remove an expense entry by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Expense ID is required"
      }, { status: 400 });
    }

    // Delete the expense entry
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json({
        success: false,
        message: "Expense entry not found"
      }, { status: 404 });
    }

    console.log("✅ Expense entry deleted successfully:", deletedExpense._id);

    return NextResponse.json({
      success: true,
      message: "Expense entry deleted successfully",
      data: {
        id: deletedExpense._id,
        amount: deletedExpense.amount
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting expense entry:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
