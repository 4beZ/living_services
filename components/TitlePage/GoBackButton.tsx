import { useRouter } from "next/navigation"
import styles from "./GoBackButton.module.css"
import { BsArrowReturnLeft } from "react-icons/bs"
import { motion } from "framer-motion"
import { fallingBlock } from "@/variants"

const GoBackButton = () => {
  const router = useRouter()

  return (
    <motion.div
      variants={fallingBlock}
      initial='hidden'
      animate='visible'
      whileHover={{
        cursor: "pointer",
        scale: 1.05,
        backgroundColor: "var(--eerie-black)",
      }}
      whileTap={{
        scale: 0.95,
      }}
      className={`${styles.round} block shadow`}
      onClick={() => router.back()}>
      <BsArrowReturnLeft />
    </motion.div>
  )
}

export default GoBackButton
