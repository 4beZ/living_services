"use client"

import { motion } from "framer-motion"

import userStyles from "./UserPage.module.css"

import Block from "./Block"
import { flyingBlock } from "@/variants"
import { useState } from "react"
import TableBlock from "./Admin/TableBlock"
import GoBackButton from "./GoBackButton"
import { ThemeProvider, createTheme } from "@mui/material"
import { ruRU as coreRu } from "@mui/material/locale"
import { ruRU } from "@mui/x-data-grid"

const optionsToRender = [
  { text: "Жители", type: "residents", value: 0 },
  { text: "Операторы", type: "operators", value: 1 },
  { text: "Заявки", type: "applications", value: 2 },
  { text: "Отделения", type: "departments", value: 3 },
  { text: "Машины", type: "cars", value: 4 },
  { text: "Инструменты", type: "tools", value: 5 },
]

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  ruRU,
  coreRu
)

const AdminPage = () => {
  const [state, setstate] = useState<number>(-1)

  return (
    <div className={userStyles.area}>
      <GoBackButton />
      <motion.h1
        variants={flyingBlock}
        initial='hidden'
        animate='visible'
        exit='exit'>
        Админ
      </motion.h1>
      <section>
        {optionsToRender.map((block, i) => (
          <Block
            height={70}
            click={() => setstate(block.value)}
            key={i}
            active={state === i}>
            <p>{block.text}</p>
          </Block>
        ))}
      </section>
      <ThemeProvider theme={theme}>
        <TableBlock type={state == -1 ? "" : optionsToRender[state].type} />
      </ThemeProvider>
    </div>
  )
}

export default AdminPage
