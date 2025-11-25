import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Income from '@/lib/models/Income';
import Team from '@/lib/models/Team';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET handler to fetch income for user's accessible teams
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

    // Find all teams the user has access to
    const accessibleTeams = await Team.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    }).select('teamName');

    // Get team names the user can access
    const teamNames = accessibleTeams.map(t => t.teamName);

    // Fetch only incomes belonging to accessible teams
    const incomes = await Income.find({
      teamName: { $in: teamNames }
    }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      data: incomes
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching incomes:", error);

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

    // Get user ID from header (sent by frontend)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated"
      }, { status: 401 });
    }

    // Validation - ensure required fields
    if (!title || !amount || !category) {
      return NextResponse.json({
        success: false,
        error: "Please provide title, amount, and category"
      }, { status: 400 });
    }

    // Verify user has access to the team
    if (teamName && teamName !== "Default Team") {
      const team = await Team.findOne({
        teamName: teamName,
        $or: [
          { createdBy: userId },
          { members: userId }
        ]
      });

      if (!team) {
        return NextResponse.json({
          success: false,
          error: "You don't have access to this team"
        }, { status: 403 });
      }
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
