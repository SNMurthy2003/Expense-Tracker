import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Team from '@/lib/models/Team';

// DELETE handler to remove a team by ID
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

    // Delete the team from MongoDB
    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json({
        success: false,
        message: "Team not found"
      }, { status: 404 });
    }

    console.log("✅ Team deleted successfully:", deletedTeam.teamName);

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
      data: deletedTeam
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
