import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// DELETE handler to remove a team by ID and cascade delete all related data
// Only the team creator can delete the team
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // Get user ID from header (sent by frontend)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated"
      }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Team ID is required"
      }, { status: 400 });
    }

    // First, find the team to verify ownership
    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json({
        success: false,
        message: "Team not found"
      }, { status: 404 });
    }

    // Check if user is the creator
    if (team.createdBy !== userId) {
      return NextResponse.json({
        success: false,
        message: "Only the team creator can delete this team"
      }, { status: 403 });
    }

    // Delete the team
    await Team.findByIdAndDelete(id);

    // CASCADE DELETE: Remove all related income and expense entries
    const [deletedIncomes, deletedExpenses] = await Promise.all([
      Income.deleteMany({ teamName: team.teamName }),
      Expense.deleteMany({ teamName: team.teamName })
    ]);

    console.log("✅ Team deleted successfully:", team.teamName);
    console.log(`   └─ Deleted ${deletedIncomes.deletedCount} income entries`);
    console.log(`   └─ Deleted ${deletedExpenses.deletedCount} expense entries`);

    return NextResponse.json({
      success: true,
      message: "Team and all related data deleted successfully",
      data: {
        team: team,
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
