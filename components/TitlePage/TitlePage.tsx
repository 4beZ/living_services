"use client"

import { fallingBlock, flyingBlock } from "@/variants"
import { motion } from "framer-motion"
import Block from "./Block"
import Link from "next/link"

const TitlePage = () => {
  return (
    <motion.div className='info' initial='hidden' animate='visible' exit='exit'>
      <motion.h1 className='mainTitle' variants={fallingBlock}>
        ЖКХ
      </motion.h1>
      <motion.p variants={flyingBlock} transition={{ delay: 0.5 }}>
        Таким вы его еще не видели
      </motion.p>
      <motion.i variants={fallingBlock} transition={{ delay: 1 }}>
        Кто я?
      </motion.i>
      <div className='options'>
        <Link href='/user'>
          <Block width={300} height={300} extraDelay={true}>
            <b>Житель</b>
            <p>Хочу оставить заявку</p>
          </Block>
        </Link>
        <Link href='/admin'>
          <Block width={300} height={300} extraDelay={true}>
            <b>Админ</b>
            <p>Хочу управлять</p>
          </Block>
        </Link>
      </div>
    </motion.div>
  )
}

export default TitlePage
