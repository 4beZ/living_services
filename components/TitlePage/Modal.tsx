import { ReactNode } from "react"

import styles from "./Modal.module.css"

import { motion, AnimatePresence } from "framer-motion"
import { animationStates, fallingBlock, flyingBlock } from "@/variants"

const Modal = ({
  children,
  active,
}: {
  children: ReactNode
  active: boolean
}) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.main
          className={styles.main}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className='block shadow'
            variants={flyingBlock}
            {...animationStates}>
            {children}
          </motion.div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}

export default Modal
