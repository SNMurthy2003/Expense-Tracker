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
    const { teamName, icon } = body;

    // Validation - ensure required fields
    if (!teamName) {
      return NextResponse.json({
        success: false,
        error: "Team name is required"
      }, { status: 400 });
    }

    // Create new team
    const team = new Team({
      teamName,
      icon: icon || "FaBriefcase"
    });

    const savedTeam = await team.save();

    return NextResponse.json({
      success: true,
      message: "Team created successfully",
      data: savedTeam
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating team:", error);

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create team"
    }, { status: 500 });
  }
}
