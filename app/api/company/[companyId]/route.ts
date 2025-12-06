import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const { companyId } = await context.params;

  return NextResponse.json({ message: "Company route working", companyId });
}

export async function PUT(req: Request, context: any) {
  const { companyId } = await context.params;
  const body = await req.json();

  return NextResponse.json({ message: "Updated", companyId, body });
}

export async function DELETE(req: Request, context: any) {
  const { companyId } = await context.params;

  return NextResponse.json({ message: "Deleted", companyId });
}
