import { FC, useState, useEffect } from "react"
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid"

import styles from "./TableBlock.module.css"

import { AnimatePresence, motion } from "framer-motion"

import { columns } from "@/tableColumns"

import Selection from "./Selection"

interface ITableBlock {
  type: string
}

const TableBlock: FC<ITableBlock> = ({ type }) => {
  const [rows, setRows] = useState([])
  const [name, setname] = useState("")
  const [selectedRows, setselectedRows] = useState([])
  const [showSelection, setshowSelection] = useState(false)

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([])

  const getData = async () => {
    if (!type) return
    const url = `api/${type}`
    const result = await fetch(url, { cache: "no-store" }).then(
      async (res) => await res.json()
    )

    setRows(result.rows)
    setname(result.name)
  }

  const selectHandler = () => {
    setselectedRows(
      rows.filter((row) => rowSelectionModel.includes(row[Object.keys(row)[0]]))
    )
    setshowSelection(true)
  }

  useEffect(() => {
    getData()
    setRowSelectionModel([])
  }, [type])

  function getRowId(row: any) {
    return row[Object.keys(row)[0]]
  }

  const editStatus = async (applicId: number, status: string) => {
    let statusId: number

    switch (status) {
      case "Accepted":
        statusId = 1
        break
      case "In progress":
        statusId = 2
        break
      case "Solved":
        statusId = 3
        break
      default:
        statusId = 1
        break
    }

    const url = `api/changeStatus`
    const body = {
      applicId: Number(applicId),
      statusId,
    }

    try {
      let result = await fetch(url, {
        cache: "no-store",
        method: "PATCH",
        body: JSON.stringify(body),
      })

      if (!result.ok) throw Error("error while changing status")

      result = await result.json()
      console.log(result)

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const rowUpdate = (updatedRow: any, originalRow: any) => {
    if (updatedRow["Статус_выполнения"] === originalRow["Статус_выполнения"])
      return updatedRow

    const result = editStatus(
      updatedRow["Номер_заявки"],
      updatedRow["Статус_выполнения"]
    )
    if (!result) return originalRow
    return updatedRow
  }

  const deleteRows = async () => {
    let ids = "(" + rowSelectionModel.join(",") + ")"
    const url = `api/${type}`
    const body = {
      ids,
    }

    try {
      let result = await fetch(url, {
        cache: "no-store",
        method: "DELETE",
        body: JSON.stringify(body),
      })

      if (!result.ok) throw Error("error while deleting rows")

      result = await result.json()
      console.log(result)

      await getData()
      setshowSelection(false)

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  if (rows.length == 0) return null

  return (
    <motion.div
      style={{
        marginBottom: "80px",
      }}
      className='block shadow'
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: 0.2 },
      }}
      exit={{
        opacity: 0,
      }}>
      <AnimatePresence mode='wait'>
        <div className={styles.head}>
          <motion.h1
            key={type}
            style={{ marginBottom: "10px" }}
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.2 },
            }}
            exit={{
              opacity: 0,
            }}>
            {name}
          </motion.h1>
          <button onClick={selectHandler}>Выборка</button>
        </div>
      </AnimatePresence>
      <DataGrid
        processRowUpdate={rowUpdate}
        onProcessRowUpdateError={() => console.log("error")}
        isCellEditable={(params) =>
          params.row["Статус_выполнения"] !== "Solved"
        }
        getRowHeight={() => "auto"}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel)
        }}
        rowSelectionModel={rowSelectionModel}
        disableRowSelectionOnClick
        getRowId={getRowId}
        rows={rows}
        columns={columns[type]}
        pageSizeOptions={[5]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        checkboxSelection
        sx={{
          backgroundColor: "var(--platinum)",
          color: "var(--eerie-black)",
          borderRadius: "10px",
          borderWidth: "3px",
          borderColor: "var(--eerie-black)",
          "& .MuiDataGrid-withBorderColor": {
            borderColor: "var(--onyx)",
          },
          "& .MuiToolbar-root": {
            color: "var(--eerie-black)",
          },
        }}
      />
      <AnimatePresence>
        {showSelection && selectedRows.length > 0 && (
          <Selection
            rows={selectedRows}
            columns={columns[type]}
            showSelection={setshowSelection}
            type={type}
            deleteRows={deleteRows}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TableBlock
