import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: "Avatar upload failed", error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Avatar upload failed" },
      { status: 500 }
    );
  }
}
