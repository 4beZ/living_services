import { useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { animationStates, fallingBlock } from "@/variants"
import { useResident } from "@/hooks/useResident"
import Errors from "../Errors"

const CheckDebt = () => {
  const { getResident, resident, residentFound, forceClear } = useResident()
  const [phone, setphone] = useState<string>("+7")
  const [payDebtSum, setpayDebtSum] = useState<number>(0)

  const [lastError, setlastError] = useState<string>("")
  const [sentPressCount, setsentPressCount] = useState<number>(0)

  const phoneChangeHandler = (value: string) => {
    if (value.length < 2 || value.slice(0, 2) != "+7") return

    setphone(value)
  }

  const requestHandler = async () => {
    if (phone.length < 12) {
      setlastError("Некорректный номер телефона")
      return setsentPressCount((prev) => prev + 1)
    }
    await getResident(phone)
  }

  const payDebt = async () => {
    try {
      if (payDebtSum > resident["Задолжность"]) {
        setsentPressCount((prev) => prev + 1)
        return setlastError("Слишком много деняг!")
      }
      if (payDebtSum === 0) {
        setsentPressCount((prev) => prev + 1)
        return setlastError("Ничего вы не платите!")
      }
      if (payDebtSum < 0) {
        setsentPressCount((prev) => prev + 1)
        return setlastError(`Заплатить ${payDebtSum}... Это как?`)
      }

      const url = `/api/pay`
      const res = await fetch(url, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({
          resId: resident["Номер_жителя"],
          sum: payDebtSum,
        }),
      })
      const { message } = await res.json()

      if (res.ok) {
        console.log(message)
        await getResident(phone)
        setpayDebtSum(0)
      } else {
        throw new Error(message)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='block shadow'>
      <h1 style={{ marginBottom: "15px" }}>Проверка долга</h1>
      <div className='field'>
        <div className='block inputBlock'>
          <p>Номер телефона</p>
          <input
            type='text'
            maxLength={12}
            value={phone}
            onChange={(e) => phoneChangeHandler(e.target.value)}
          />
          <button onClick={requestHandler}>Проверить</button>
        </div>
        <AnimatePresence mode='wait'>
          {residentFound && (
            <>
              <motion.div
                className='block'
                variants={fallingBlock}
                {...animationStates}>
                <b>Задолжность</b>
                <motion.p
                  key={resident["Номер_жителя"]}
                  variants={fallingBlock}
                  {...animationStates}
                  style={{ fontSize: "2em" }}>
                  {resident["Задолжность"]} рублей
                </motion.p>
              </motion.div>
              {Number(resident["Задолжность"]) > 0 && (
                <>
                  <motion.h1
                    style={{ width: "100%" }}
                    variants={fallingBlock}
                    {...animationStates}>
                    Давайте погасим долг
                  </motion.h1>
                  <motion.div
                    className='block'
                    variants={fallingBlock}
                    {...animationStates}>
                    <b>Внесите сумму</b>
                    <input
                      type='number'
                      max={Number(resident["Задолжность"])}
                      value={payDebtSum}
                      onChange={(e) => setpayDebtSum(Number(e.target.value))}
                    />
                    <button onClick={payDebt}>Погасить</button>
                  </motion.div>
                </>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
      <Errors message={{ value: lastError, id: sentPressCount }} />
    </div>
  )
}

export default CheckDebt
