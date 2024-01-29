import { changeStatus } from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    const { applicId, statusId } = body

    await changeStatus(applicId, statusId)

    return NextResponse.json("Succesfully changed")
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}
