import { NextResponse } from "next/server";
import { mockEvents } from "./mockdata";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const now = new Date();

  // Sort events by how close their start date is to the current date
  // Drizzle ORM will solve this once we set up a real db
  const sortedByClosestDate = [...mockEvents].sort((a, b) => {
    const diffA = Math.abs(new Date(a.dateStart).getTime() - now.getTime());
    const diffB = Math.abs(new Date(b.dateStart).getTime() - now.getTime());
    return diffA - diffB;
  });

  if (limit) {
    const num = parseInt(limit, 10);
    if (!isNaN(num) && num > 0) {
      return NextResponse.json(sortedByClosestDate.slice(0, num));
    }
  }

  return NextResponse.json(sortedByClosestDate);
}
