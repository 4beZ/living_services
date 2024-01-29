import { useResident } from "@/hooks/useResident"
import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"

import styles from "./CreateApplication.module.css"
import { animationStates, fallingBlock } from "@/variants"

import Errors from "../Errors"
import Modal from "../Modal"
import Help from "../Help"

const CreateApplication = () => {
  const { resident, getResident, residentFound, forceClear } = useResident()

  const [reqLoading, setreqLoading] = useState(false)
  const [createdAplicId, setcreatedAplicId] = useState(0)
  const [modalActive, setmodalActive] = useState<boolean>(false)

  const [lastError, setlastError] = useState<string>("")
  const [sentPressCount, setsentPressCount] = useState<number>(0)

  const [phone, setphone] = useState<string>("+7")
  const [form, setform] = useState({
    residentNumber: null,
    type: "",
    problem: "",
    dateTime: "",
    name: "",
    ad_street: "",
    ad_building: "",
    ad_corpus: "",
    ad_parad: "",
    ad_flat: "",
  })

  const phoneChangeHandler = (value: string) => {
    if (value.length < 2 || value.slice(0, 2) != "+7") return

    setphone(value)
  }

  const sendApplication = async () => {
    const clearBuilding = form.ad_building.replaceAll(" ", "")
    const val = () => {
      if (!residentFound) {
        if (form.name.length < 2 || form.name.length > 18) {
          setlastError("Некорректное имя (2 - 18) символов")
          return false
        }
        if (form.ad_street.length < 2 || form.ad_street.length > 18) {
          setlastError("Некорректное название улицы (2 - 18) символов")
          return false
        }

        if (!clearBuilding) {
          setlastError("Введите номер дома")
          return false
        } else {
          let check = true
          if (clearBuilding.length === 1 && !/\d/.test(clearBuilding)) {
            check = false
          } else if (
            clearBuilding.length === 2 &&
            !/\d\d/.test(clearBuilding) &&
            !/\d[A-Za-za-яА-Я]/.test(clearBuilding)
          ) {
            check = false
          } else if (
            clearBuilding.length === 3 &&
            !/\d\d\d/.test(clearBuilding) &&
            !/\d\d[A-Za-za-яА-Я]/.test(clearBuilding)
          ) {
            check = false
          }

          if (!check) {
            setlastError("Введите корректный номер дома")
            return false
          }
        }

        if (!form.ad_flat || Number(form.ad_flat) < 1) {
          setlastError("Введите квартиру")
          return false
        }
      }

      if (!form.dateTime) {
        setlastError("Введите дату и время повяления")
        return false
      }
      if (Date.parse(form.dateTime) > Date.now()) {
        setlastError("Ваша дата и время находятся в будущем")
        return false
      }
      if (form.type.length < 3 || form.type.length > 18) {
        setlastError("Введите тип проблемы (3-18 символов)")
        return false
      }
      if (form.problem.length < 10) {
        setlastError("Опишите проблему (больше 10 символов)")
        return false
      }

      return true
    }

    if (!val()) return setsentPressCount((prev) => prev + 1)

    setreqLoading(true)
    setmodalActive(true)

    const url = "/api/application"
    const body = {
      residentExists: residentFound,
      form: {
        ...form,
        phone: phone.slice(1, phone.length),
        ad_building: clearBuilding,
      },
    }

    try {
      const res = await fetch(url, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw Error("lol")
      }

      const result = await res.json()

      forceClear()
      setphone("+7")
      setcreatedAplicId(result)

      return setreqLoading(false)
    } catch (e) {
      return console.log(e)
    }
  }

  const handleFormChange = (name: string, value: string | number) => {
    if ((name === "ad_corpus" || name == "ad_parad") && Number(value) > 10)
      return
    if (name === "ad_flat" && Number(value) > 1000) return

    setform({ ...form, [name]: value })
  }

  const checkResidentExists = async () => {
    if (phone.length < 12) {
      setlastError("Некорректный номер телефона")
      return setsentPressCount((prev) => prev + 1)
    }
    await getResident(phone)
  }

  useEffect(() => {
    if (residentFound)
      return setform({
        type: "",
        problem: "",
        dateTime: "",
        name: "",
        ad_street: "",
        ad_building: "",
        ad_corpus: "",
        ad_parad: "",
        ad_flat: "",
        residentNumber: resident["Номер_жителя"],
      })
    else
      return setform({
        type: "",
        problem: "",
        dateTime: "",
        name: "",
        ad_street: "",
        ad_building: "",
        ad_corpus: "",
        ad_parad: "",
        ad_flat: "",
        residentNumber: null,
      })
  }, [residentFound])

  useEffect(() => {
    forceClear()
  }, [phone])

  return (
    <div className='block shadow' style={{ marginBottom: "80px" }}>
      <h1 style={{ marginBottom: "15px" }}>Оформление заявки</h1>
      <div className='block inputBlock' style={{ width: "45%" }}>
        <p>Номер телефона</p>
        <input
          type='text'
          maxLength={12}
          value={phone}
          onChange={(e) => phoneChangeHandler(e.target.value)}
        />
        <button onClick={checkResidentExists}>Ввести</button>
      </div>
      {residentFound != null && (
        <motion.div
          className='field'
          {...animationStates}
          style={{ marginTop: "15px" }}>
          {residentFound ? (
            <CutForm
              resident={resident}
              handleFormChange={handleFormChange}
              form={form}
            />
          ) : (
            <FullForm
              resident={resident}
              form={form}
              handleFormChange={handleFormChange}
            />
          )}
        </motion.div>
      )}

      {residentFound != null && (
        <button
          style={{ marginTop: "15px" }}
          onClick={sendApplication}
          disabled={reqLoading}>
          Отправить
        </button>
      )}
      <Errors message={{ value: lastError, id: sentPressCount }} />
      <Modal active={modalActive}>
        {reqLoading ? (
          <p>Loading</p>
        ) : (
          <>
            <h1 style={{ fontSize: "4em" }}>{createdAplicId}</h1>
            <p>Номер вашей заявки</p>
            <p style={{ marginBottom: "15px" }}>
              Запишите его куда-нибудь и не теряйте!
            </p>
            <button onClick={() => setmodalActive(false)}>Закрыть</button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default CreateApplication

const FullForm = ({
  handleFormChange,
  form,
}: {
  resident: { [key: string]: any }
  handleFormChange: Function
  form: { [key: string]: any }
}) => {
  const [showHelpBuilding, setshowHelpBuilding] = useState(false)

  return (
    <>
      <motion.div className='block' variants={fallingBlock}>
        <b>Общее</b>
        <div
          className={styles.littleInfo}
          style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <b>Имя</b>
            <input
              maxLength={20}
              type='text'
              placeholder='Имя'
              name='name'
              value={form.name}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
      </motion.div>
      <motion.div className='block' variants={fallingBlock}>
        <b>Адрес</b>
        <div className={styles.littleInfo}>
          <div>
            <b>Улица</b>
            <input
              maxLength={18}
              type='text'
              placeholder='Улица'
              name='ad_street'
              value={form.ad_street}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <b>Дом</b>
              <div
                id='helper'
                onMouseEnter={() => setshowHelpBuilding(true)}
                onMouseLeave={() => setshowHelpBuilding(false)}>
                ?
              </div>
            </div>
            <input
              maxLength={3}
              type='text'
              placeholder='Дом'
              name='ad_building'
              value={form.ad_building}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Корпус</b>
            <input
              min={0}
              max={10}
              type='number'
              placeholder='Корпус'
              name='ad_corpus'
              value={form.ad_corpus}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Подъезд</b>
            <input
              min={0}
              max={10}
              type='number'
              placeholder='Подъезд'
              name='ad_parad'
              value={form.ad_parad}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Квартира</b>
            <input
              min={0}
              max={1000}
              type='number'
              placeholder='Квартира'
              name='ad_flat'
              value={form.ad_flat}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        className='block'
        variants={fallingBlock}
        style={{ width: "100%" }}>
        <b>Проблема</b>
        <div className={`${styles.littleInfo} ${styles.problem}`}>
          <div>
            <b>Тип</b>
            <input
              maxLength={18}
              type='text'
              placeholder='Тип'
              name='type'
              value={form.type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Когда появилась</b>
            <input
              type='datetime-local'
              name='dateTime'
              value={form.dateTime}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Описание</b>
            <textarea
              placeholder='Описание'
              name='problem'
              value={form.problem}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{showHelpBuilding && <Help />}</AnimatePresence>
    </>
  )
}

const CutForm = ({
  resident,
  handleFormChange,
  form,
}: {
  resident: { [key: string]: any }
  handleFormChange: Function
  form: { [key: string]: any }
}) => {
  return (
    <>
      <motion.div className='block' variants={fallingBlock}>
        <b>Общее</b>
        <div className={styles.littleInfo}>
          <div>
            <b>Имя</b>
            <p>{resident["Имя"]}</p>
          </div>
          <div>
            <b>Задолжность</b>
            <p>{resident["Задолжность"]}</p>
          </div>
        </div>
      </motion.div>
      <motion.div className='block' variants={fallingBlock}>
        <b>Адрес</b>
        <div className={styles.littleInfo}>
          <div>
            <b>Улица</b>
            <p>{resident["Улица"]}</p>
          </div>
          <div>
            <b>Дом</b>
            <p>{resident["Дом"]}</p>
          </div>
          <div>
            <b>Корпус</b>
            <p>{resident["Корпус"]}</p>
          </div>
          <div>
            <b>Подъезд</b>
            <p>{resident["Подъезд"]}</p>
          </div>
          <div>
            <b>Квартира</b>
            <p>{resident["Квартира"]}</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className='block'
        variants={fallingBlock}
        style={{ width: "100%" }}>
        <b>Проблема</b>
        <div className={`${styles.littleInfo} ${styles.problem}`}>
          <div>
            <b>Тип</b>
            <input
              maxLength={18}
              type='text'
              placeholder='Тип'
              name='type'
              value={form.type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Когда появилась</b>
            <input
              type='datetime-local'
              name='dateTime'
              value={form.dateTime}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <b>Описание</b>
            <textarea
              placeholder='Описание'
              name='problem'
              value={form.problem}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}
