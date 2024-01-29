import { FC, useEffect, useState } from "react"

import styles from "./Errors.module.css"

import { AnimatePresence, motion } from "framer-motion"
import { animationStates, fallingBlock } from "@/variants"

interface IErrors {
  message: { value: string; id: number }
}

const Errors: FC<IErrors> = ({ message }) => {
  const [errorsList, seterrorsList] = useState<
    Array<{ message: string; id: number }>
  >([])

  useEffect(() => {
    if (message.value) {
      if (errorsList.length == 5) {
        seterrorsList((errorsList) => [
          ...errorsList.slice(1, 5),
          { message: message.value, id: message.id },
        ])
      } else {
        seterrorsList((errorsList) => [
          ...errorsList,
          { message: message.value, id: message.id },
        ])
      }
    }
  }, [message.id])

  const deleteError = (id: number) => {
    seterrorsList(errorsList.filter((er) => er.id != id))
  }

  return (
    <div className={styles.errors}>
      <AnimatePresence>
        {errorsList.map((error) => (
          <motion.div
            layout
            variants={fallingBlock}
            {...animationStates}
            key={error.id}
            className='shadow'
            onClick={() => deleteError(error.id)}>
            <p>{error.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Errors
