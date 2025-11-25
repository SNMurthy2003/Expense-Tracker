import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Team from '@/lib/models/Team';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch teams for the current user
export async function GET(request) {
  try {
    await connectDB();

    // Get user ID from header (sent by frontend)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated",
        data: []
      }, { status: 401 });
    }

    // Fetch only teams where user is creator OR member
    const teams = await Team.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: teams
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching teams:", error);

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

    // Get user ID from header (sent by frontend)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated"
      }, { status: 401 });
    }

    // Validation - ensure required fields
    if (!teamName || !teamName.trim()) {
      return NextResponse.json({
        success: false,
        error: "Team name is required"
      }, { status: 400 });
    }

    // Create new team with creator as owner and member
    const team = new Team({
      teamName: teamName.trim(),
      createdBy: userId,
      members: [userId]  // Creator is auto-added as member
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
