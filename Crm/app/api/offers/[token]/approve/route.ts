import { NextRequest, NextResponse } from "next/server";
import { approveOffer } from "@/lib/api/offers";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { optionId, installationDateId } = await req.json();

    if (!optionId) {
      return NextResponse.json(
        { message: "Brak wymaganego parametru optionId" },
        { status: 400 }
      );
    }

    if (!installationDateId) {
      return NextResponse.json(
        { message: "Brak wymaganego parametru installationDateId" },
        { status: 400 }
      );
    }

    await approveOffer(params.token, optionId, installationDateId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving offer:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Wystąpił błąd podczas zatwierdzania oferty" },
      { status: 500 }
    );
  }
}
