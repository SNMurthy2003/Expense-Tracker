import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch all teams
export async function GET() {
  try {
    await connectDB();

    const teams = await Team.find({}).sort({ createdAt: -1 });

    // Always return consistent structure with data array
    return NextResponse.json({
      success: true,
      data: teams
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching teams:", error);

    // Always return empty array to prevent frontend crashes
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch teams",
      data: []
    }, { status: 500 });
  }
}

// POST handler to add team
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { teamName } = body;

    // Validation - ensure required fields
    if (!teamName || !teamName.trim()) {
      return NextResponse.json({
        success: false,
        error: "Team name is required"
      }, { status: 400 });
    }

    // Create new team (only teamName field exists in schema)
    const team = new Team({
      teamName: teamName.trim()
    });

    const savedTeam = await team.save();

    return NextResponse.json({
      success: true,
      message: "Team created successfully",
      data: savedTeam
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating team:", error);

    // Handle duplicate team name error (MongoDB E11000)
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: "Team name already exists. Please choose a different name."
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create team"
    }, { status: 500 });
  }
}
