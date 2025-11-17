import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Team from '@/lib/models/Team';

// GET handler to fetch all teams
export async function GET(request) {
  try {
    await connectDB();

    const teams = await Team.find({});

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}

// POST handler to add team
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const team = new Team(body);
    const savedTeam = await team.save();

    return NextResponse.json(savedTeam, { status: 201 });
  } catch (error) {
    console.error("Error adding team:", error);
    return NextResponse.json({
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
