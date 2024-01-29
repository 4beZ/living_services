import {
  createApplication,
  createProblem,
  createResidentAdress,
  deleteSomeRows,
  getApplications,
  getCars,
  getDepartments,
  getOperators,
  getResidents,
  getTools,
} from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const { tableName } = params
    const searchParams = request.nextUrl.searchParams
    const id = Number(searchParams.get("id"))
    const phone = searchParams.get("phone")

    let name
    let res
    switch (tableName) {
      case "applications":
        name = "Заявки"
        res = await getApplications()
        break
      case "operators":
        name = "Операторы"
        res = await getOperators()
        break
      case "residents":
        name = "Жители"
        res = await getResidents(phone)
        break
      case "cars":
        name = "Машины"
        res = await getCars()
        break
      case "departments":
        name = "Отделения"
        res = await getDepartments()
        break
      case "tools":
        name = "Инструменты"
        res = await getTools()
        break
      default:
        res = {
          messge: "nothing",
        }
    }

    return NextResponse.json({ rows: res, name })
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const body = await request.json()

    const { tableName } = params
    const searchParams = request.nextUrl.searchParams
    const id = Number(searchParams.get("id"))
    const phone = searchParams.get("phone")

    let res
    switch (tableName) {
      case "residentAdress":
        const { street, building, corpus, parad, flat } = body
        res = await createResidentAdress(street, building, corpus, parad, flat)
        break
      case "application":
        res = await createApplication(body.residentExists, body.form)
        break
      case "problem":
        const { problem, type, dateTime } = body
        res = await createProblem(problem, type, dateTime)
        break
      case "application":
        const { residentExists, form } = body
        res = await createApplication(residentExists, form)
        break
      default:
        res = {
          messge: "nothing",
        }
    }

    return NextResponse.json(res)
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const body = await request.json()

    const { tableName } = params
    const { ids } = body

    await deleteSomeRows(tableName, ids)

    return NextResponse.json("Succesfully deleted")
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  }
}
