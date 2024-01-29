"use client"
import { MouseEventHandler } from "react"
import styles from "./Block.module.css"

import { motion } from "framer-motion"

const Block = ({
  children,
  width = 180,
  height = 180,
  extraDelay = false,
  click = () => {},
  active = false,
}: {
  children: React.ReactNode
  width?: number
  height?: number
  extraDelay?: boolean
  click?: MouseEventHandler<HTMLDivElement>
  active?: boolean
}) => {
  return (
    <motion.div
      onClick={click}
      className={`${styles.block} ${active ? styles.active : ""}`}
      style={{
        width: width,
        height: height,
      }}
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { delay: extraDelay ? 1 : 0.5 },
      }}
      whileHover={{
        scale: 1.05,
        cursor: "pointer",
        backgroundColor: "hsla(288, 100%, 50%, 1)",
      }}
      whileTap={{ scale: 0.95 }}>
      {children}
    </motion.div>
  )
}

export default Block
