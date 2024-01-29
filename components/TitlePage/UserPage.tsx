"use client"

import { AnimatePresence, motion } from "framer-motion"
import styles from "./UserPage.module.css"
import Block from "./Block"
import { flyingBlock } from "@/variants"
import { useState } from "react"
import CheckApplication from "./User/CheckApplication"
import CreateApplication from "./User/CreateApplication"
import CheckDebt from "./User/CheckDebt"
import GoBackButton from "./GoBackButton"

const optionsToRender = [
  { text: "Оставить заявку", value: 0 },
  { text: "Проверить заявку", value: 1 },
  { text: "Долги", value: 2 },
]
const blocksToRender = [
  { element: <CreateApplication />, value: 0 },
  { element: <CheckApplication />, value: 1 },
  { element: <CheckDebt />, value: 2 },
]

const UserPage = () => {
  const [state, setstate] = useState<number>(-1)

  return (
    <div className={styles.area}>
      <GoBackButton />
      <motion.h1
        variants={flyingBlock}
        initial='hidden'
        animate='visible'
        exit='exit'>
        Житель
      </motion.h1>
      <section>
        {optionsToRender.map((block, i) => (
          <Block
            height={100}
            click={() => setstate(block.value)}
            key={i}
            active={state === i}>
            <p>{block.text}</p>
          </Block>
        ))}
      </section>
      <AnimatePresence mode='wait'>
        <motion.div
          key={blocksToRender[state] ? blocksToRender[state].value : "empty"}
          initial={{ opacity: 0, x: 200 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 0.2 },
          }}
          exit={{
            opacity: 0,
            scale: 0,
          }}>
          {blocksToRender[state] ? blocksToRender[state].element : ""}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default UserPage
