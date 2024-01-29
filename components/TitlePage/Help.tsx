import { animationStates, fallingBlock } from "@/variants"
import styles from "./Help.module.css"

import { motion } from "framer-motion"

const Help = () => {
  return (
    <motion.div
      className={`${styles.help} ${styles.help2}`}
      {...animationStates}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <section className='shadow'>
        <b>Правильно</b>
        <div className={styles.littleGrid}>
          <div>
            <b>1</b>
          </div>
          <div>
            <b>1б</b>
          </div>
          <div>
            <b>12ц</b>
          </div>
          <div>
            <b>123</b>
          </div>
        </div>
      </section>
      <section className='shadow'>
        <b>Неправильно</b>
        <div className={styles.littleGrid}>
          <div>
            <b>ijk</b>
          </div>
          <div>
            <b>ko2</b>
          </div>
          <div>
            <b>o</b>
          </div>
          <div>
            <b>!!!</b>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Help
