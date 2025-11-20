import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Income from '@/lib/models/Income';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// DELETE handler to remove an income entry by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Income ID is required"
      }, { status: 400 });
    }

    // Delete the income entry
    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return NextResponse.json({
        success: false,
        message: "Income entry not found"
      }, { status: 404 });
    }

    console.log("✅ Income entry deleted successfully:", deletedIncome._id);

    return NextResponse.json({
      success: true,
      message: "Income entry deleted successfully",
      data: {
        id: deletedIncome._id,
        amount: deletedIncome.amount
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting income entry:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
