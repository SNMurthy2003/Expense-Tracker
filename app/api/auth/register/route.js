import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST handler for registration
// Firebase handles authentication client-side
export async function POST(request) {
  try {
    const body = await request.json();

    // Since Firebase handles auth client-side, this endpoint
    // can be used for logging or server-side user setup if needed
    console.log("Registration request received");

    return NextResponse.json({
      success: true,
      message: "Registration handled by Firebase client-side"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
