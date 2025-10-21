import { NextResponse } from "next/server";
import { mockEvents } from "../mockdata";


export async function GET(_: Request, { params }: { params: { id: string } }) {
  const event = mockEvents.find((e) => e.id === params.id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}