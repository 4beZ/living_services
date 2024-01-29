import mysql from "mysql2"

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "wrappingtrans",
    database: "жкххх",
  })
  .promise()

export async function getOperators() {
  const [rows] = await pool.query(
    "SELECT опер.Номер_оператора, опер.Имя, опер.Телефон, отд.Название_отделения " +
      "FROM оператор опер " +
      "LEFT JOIN отделение отд ON опер.Номер_отделения = отд.Номер_отделения"
  )
  return rows
}
export async function getApplications() {
  let [rows]: any = await pool.query(
    "SELECT з.Номер_заявки, пр.Тип_проблемы, пр.Описание_проблемы, пр.Дата_и_время_появления, з.Дата_и_время_регистрации, ст.Статус_выполнения " +
      "FROM заявка з " +
      "LEFT JOIN проблема пр ON з.Номер_проблемы = пр.Номер_проблемы " +
      "LEFT JOIN статус_выполнения ст ON з.Номер_статуса_выполнения = ст.Номер_статуса_выполнения"
  )
  rows = rows.map((row: any) => {
    if (row["Описание_проблемы"].length > 60) {
      return {
        ...row,
        ["Описание_проблемы"]: row["Описание_проблемы"].slice(0, 60) + "...",
      }
    } else return row
  })
  return rows
}
export async function getResidents(phone?: string | null) {
  const [rows] = await pool.query(
    "SELECT Номер_жителя, Мобильный_телефон, Имя, Задолжность, Улица, Дом, Корпус, Подъезд, Квартира " +
      "FROM житель ж " +
      "LEFT JOIN адрес_жителя аж ON ж.Номер_адреса_жителя = аж.Номер_адреса_жителя" +
      `${phone ? " WHERE ж.Мобильный_телефон = ?" : ""}`,
    [phone]
  )
  return rows
}
export async function getCars() {
  const [rows] = await pool.query(
    "SELECT Номер_машины, Марка, Год_выпуска, Пробег, Масса, Номер_автопарка, Статус " +
      "FROM машина м " +
      "LEFT JOIN статус_машины см ON м.Номер_статуса = см.Номер_статуса"
  )
  return rows
}
export async function getDepartments() {
  const [rows] = await pool.query(
    "SELECT Номер_отделения as ID, Название_отделения as Название, Улица, Дом, Подъезд, Название_района as Район, Коэффициент_аварийности as Аварийность " +
      "FROM отделение отд " +
      "LEFT JOIN адрес_отделения аотд ON отд.Номер_адреса = аотд.Номер_адреса " +
      "LEFT JOIN район р ON отд.Номер_района = р.Номер_района"
  )
  return rows
}
export async function getTools() {
  const [rows] = await pool.query(
    "SELECT Номер_инструмента as ID, Тип_инструмента as Тип, Год_производства as Год, Предназначение, Номер_склада as Склад " +
      "FROM инструмент"
  )
  return rows
}

export async function findApplication(id: number, phone: string) {
  const [rows] = await pool.query(
    "SELECT Номер_заявки, Статус_выполнения, Дата_и_время_регистрации, Дата_и_время_выполнения, Имя, Мобильный_телефон, Номер_заявки, Описание_проблемы FROM заявка " +
      "JOIN житель ON заявка.Номер_жителя = житель.Номер_жителя " +
      "JOIN статус_выполнения ON заявка.Номер_статуса_выполнения = статус_выполнения.Номер_статуса_выполнения " +
      "JOIN проблема ON заявка.Номер_проблемы = проблема.Номер_проблемы " +
      "WHERE Номер_заявки = ? AND Мобильный_телефон = ?",
    [id, phone]
  )
  return rows
}
export async function findAvailableOperator() {
  const res = await pool.query(
    "SELECT Номер_оператора, count(Номер_заявки) as количество from заявка " +
      "GROUP BY Номер_оператора"
  )
  const rows: any = res[0]
  let min = rows[0]["количество"]
  let avId = rows[0]["Номер_оператора"]
  for (const operator of rows) {
    if (operator["количество"] < min) {
      min = operator["количество"]
      avId = operator["Номер_оператора"]
    }
  }

  return avId
}

export async function createApplication(
  residentExists: boolean,
  form: { [key: string]: any }
) {
  let {
    residentNumber,
    name,
    phone,
    ad_street,
    ad_building,
    ad_corpus,
    ad_parad,
    ad_flat,
    problem,
    type,
    dateTime,
  } = form
  ad_corpus = ad_corpus == "" || 0 || null ? null : Number(ad_corpus)
  ad_parad = ad_parad == "" || 0 || null ? null : Number(ad_parad)
  ad_flat = Number(ad_flat)

  const problemId = await createProblem(problem, type, dateTime)
  const operatorId = await findAvailableOperator()
  if (residentExists) {
    const result: any = await pool.query(
      "insert into заявка (Номер_оператора, Дата_и_время_регистрации, Номер_жителя, Номер_проблемы, Номер_статуса_выполнения) " +
        "values (?, NOW(), ?, ?, ?)",
      [operatorId, residentNumber, problemId, 1]
    )
    const rows = result[0]
    return rows.insertId
  } else {
    residentNumber = await createResident(
      false,
      name,
      phone,
      ad_street,
      ad_building,
      ad_corpus,
      ad_parad,
      ad_flat
    )
    const result: any = await pool.query(
      "insert into заявка (Номер_оператора, Дата_и_время_регистрации, Номер_жителя, Номер_проблемы, Номер_статуса_выполнения) " +
        "values (?, NOW(), ?, ?, ?)",
      [operatorId, residentNumber, problemId, 1]
    )
    const rows = result[0]
    return rows.insertId
  }
}
export async function createResident(
  hasAdress: boolean,
  name: string,
  phone: string,
  ad_street: string,
  ad_building: string,
  ad_corpus: number | null,
  ad_parad: number | null,
  ad_flat: number
) {
  if (!hasAdress) {
    const adressId = await createResidentAdress(
      ad_street,
      ad_building,
      ad_corpus,
      ad_parad,
      ad_flat
    )
    const result: any = await pool.query(
      "insert into житель (Мобильный_телефон, имя, Задолжность, Номер_адреса_жителя) " +
        "values (?, ?, ?, ?)",
      [phone, name, 0, adressId]
    )
    const rows = result[0]
    return rows.insertId
  }
}
export async function createResidentAdress(
  street: string,
  building: string,
  corpus: number | null,
  parad: number | null,
  flat: number
) {
  const result: any = await pool.query(
    "insert into адрес_жителя (Улица, дом, корпус, Подъезд, Квартира) " +
      "values (?, ?, ?, ?, ?)",
    [street, building, corpus, parad, flat]
  )
  const rows = result[0]
  return rows.insertId
}
export async function createProblem(
  problem: string,
  type: string,
  dateTime: string
) {
  const result: any = await pool.query(
    "insert into проблема (Тип_проблемы, Описание_проблемы, Дата_и_время_появления) " +
      "values (?, ?, ?)",
    [type, problem, dateTime]
  )
  const rows = result[0]
  return rows.insertId
}
export async function payDebt(id: number, sum: number) {
  const result: any = await pool.query(
    `update житель ж
    set ж.Задолжность = ж.Задолжность - ?
    where ж.Номер_жителя = ?;`,
    [sum, id]
  )
  const rows = result[0]
  return rows.insertId
}
export async function changeStatus(applicationId: number, statusId: number) {
  const result: any = await pool.query(
    `update заявка з
    set з.Номер_статуса_выполнения = ?
    where з.Номер_заявки = ?;`,
    [statusId, applicationId]
  )
  const rows = result[0]
  return rows.insertId
}
export async function deleteSomeRows(type: string, ids: string) {
  const types = new Map([
    ["applications", "заявка"],
    ["cars", "машина"],
  ])
  const idNames = new Map([
    ["applications", "Номер_заявки"],
    ["cars", "Номер_машины"],
  ])

  const tableName = types.get(type)
  const tableIdName = idNames.get(type)

  if (!tableName || !tableIdName) return

  const result: any = await pool.query(
    `delete from ${tableName} where ${tableIdName} in ${ids}`
  )
  const rows = result[0]
  return rows.insertId
}
