import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const POST_TYPES = ["post"];
const LAB_TYPES = ["labProject", "labStatus", "labSettings"];

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const type: string = body._type ?? "";

    if (POST_TYPES.includes(type)) revalidateTag("post", "max");
    if (LAB_TYPES.includes(type)) revalidateTag("lab", "max");

    return NextResponse.json({ revalidated: true, type });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
