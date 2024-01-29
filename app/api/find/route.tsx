import { findApplication } from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = Number(searchParams.get("id"))
    const phone = searchParams.get("phone")

    const res = await findApplication(id, phone!)

    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
