import { payDebt } from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resId, sum } = body

    await payDebt(resId, sum)

    return NextResponse.json({
      message: `Succesfully paid ${sum} rubles to ${resId} resident`,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}
