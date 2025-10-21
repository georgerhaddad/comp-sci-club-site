import { NextResponse } from "next/server";
import { mockEvents } from "../mockdata";


export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const event = await mockEvents.find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}