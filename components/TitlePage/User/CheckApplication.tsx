import { useState } from "react"
import styles from "./CheckApplication.module.css"

import { AnimatePresence, motion } from "framer-motion"
import Errors from "../Errors"

const CheckApplication = () => {
  const [form, setForm] = useState({
    applicationId: "",
    phoneNumber: "",
  })
  const [application, setApplication] = useState<{ [key: string]: any }>({})
  const [showResult, setshowResult] = useState<boolean>(false)

  const [lastError, setlastError] = useState<string>("")
  const [sentPressCount, setsentPressCount] = useState<number>(0)

  const formHandler = (fieldName: string, value: string) => {
    setForm({ ...form, [fieldName]: value })
  }

  const validate = () => {
    if (form.applicationId.length == 0) {
      setlastError("Нет номера заявки")
      return false
    } else if (form.phoneNumber.length < 11) {
      setlastError("Некорректный номер телефона")
      return false
    }
    return true
  }

  const requestHandler = async () => {
    if (!validate()) {
      setshowResult(false)
      return setsentPressCount((prev) => prev + 1)
    }

    const url = `/api/find?id=${form.applicationId}&phone=${form.phoneNumber}`
    const result = await fetch(url, { cache: "no-store" }).then(
      async (res) => await res.json()
    )

    if (result.length == 0) {
      setshowResult(true)
      return setApplication({})
    }

    setApplication(result[0])
    setshowResult(true)
  }

  return (
    <motion.div
      className={`block shadow ${styles.main} ${
        Object.keys(application).length == 0 ? styles.hidden : styles.visible
      }`}>
      <h1>Проверка заявки</h1>
      <div className={`field`}>
        <div className={`block inputBlock`}>
          <input
            type='number'
            min={1}
            placeholder='Номер заявки'
            name='applicationId'
            value={form.applicationId}
            onChange={(e) => {
              formHandler(e.target.name, e.target.value)
            }}
          />
          <input
            type='text'
            placeholder='Номер телефона'
            name='phoneNumber'
            value={form.phoneNumber}
            maxLength={11}
            onChange={(e) => {
              formHandler(e.target.name, e.target.value)
            }}
          />
          <button onClick={requestHandler}>Проверить</button>
        </div>
        <AnimatePresence>
          {showResult && (
            <motion.div
              className={`block`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}>
              {Object.keys(application).length == 0 ? (
                <b>Не найдено</b>
              ) : (
                <>
                  <h1>Заявка</h1>
                  {Object.keys(application).map((key: string, i) => (
                    <div className={styles.line} key={i}>
                      <b>{key.replaceAll("_", " ")}</b>
                      <p>
                        {application[key] === null
                          ? "Отсутствует"
                          : application[key]}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Errors message={{ value: lastError, id: sentPressCount }} />
    </motion.div>
  )
}

export default CheckApplication
