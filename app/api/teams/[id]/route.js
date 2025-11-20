import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// DELETE handler to remove a team by ID and cascade delete all related data
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Team ID is required"
      }, { status: 400 });
    }

    // First, find the team to get the teamName
    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json({
        success: false,
        message: "Team not found"
      }, { status: 404 });
    }

    // CASCADE DELETE: Remove all related income and expense entries
    const [deletedIncomes, deletedExpenses] = await Promise.all([
      Income.deleteMany({ teamName: deletedTeam.teamName }),
      Expense.deleteMany({ teamName: deletedTeam.teamName })
    ]);

    console.log("✅ Team deleted successfully:", deletedTeam.teamName);
    console.log(`   └─ Deleted ${deletedIncomes.deletedCount} income entries`);
    console.log(`   └─ Deleted ${deletedExpenses.deletedCount} expense entries`);

    return NextResponse.json({
      success: true,
      message: "Team and all related data deleted successfully",
      data: {
        team: deletedTeam,
        deletedIncomes: deletedIncomes.deletedCount,
        deletedExpenses: deletedExpenses.deletedCount
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting team:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
