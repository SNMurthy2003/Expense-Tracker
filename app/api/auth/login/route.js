import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST handler for login
// Firebase handles authentication client-side
export async function POST(request) {
  try {
    const body = await request.json();

    // Since Firebase handles auth client-side, this endpoint
    // can be used for logging or server-side session management if needed
    console.log("Login request received");

    return NextResponse.json({
      success: true,
      message: "Login handled by Firebase client-side"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
      error: error.message
    }, { status: 500 });
  }
}
