import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { FC } from "react"

import { motion } from "framer-motion"

import styles from "./Selection.module.css"

interface ISelection {
  rows: Array<{}>
  columns: GridColDef[]
  showSelection: Function
  type: string
  deleteRows: Function
}

const backVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const deletable = ["applications", "cars"]

const Selection: FC<ISelection> = ({
  rows,
  columns,
  showSelection,
  type,
  deleteRows,
}) => {
  function getRowId(row: any) {
    return row[Object.keys(row)[0]]
  }
  return (
    <motion.main
      className={styles.back}
      variants={backVariants}
      initial='hidden'
      animate='visible'
      exit='exit'>
      <motion.div>
        <DataGrid
          isCellEditable={() => false}
          checkboxSelection={false}
          getRowHeight={() => "auto"}
          disableRowSelectionOnClick
          getRowId={getRowId}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          sx={{
            backgroundColor: "var(--platinum)",
            color: "var(--eerie-black)",
            borderRadius: "10px",
            borderWidth: "3px",
            borderColor: "var(--eerie-black)",
            "& .MuiDataGrid-withBorderColor": {
              borderColor: "var(--onyx)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
            "& .MuiDataGrid-main": {
              paddingInline: "10px",
            },
            "& .MuiToolbar-root": {
              color: "var(--eerie-black)",
            },
          }}
        />
      </motion.div>
      <motion.div className={styles.buttonDiv}>
        <motion.button onClick={() => showSelection(false)}>
          Закрыть
        </motion.button>
        {deletable.includes(type) && (
          <motion.button
            className={styles.deleteBtn}
            onClick={() => deleteRows()}>
            Удалить
          </motion.button>
        )}
      </motion.div>
    </motion.main>
  )
}

export default Selection
