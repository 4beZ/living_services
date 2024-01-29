import { useState } from "react"

export const useResident = () => {
  const [resident, setresident] = useState<{ [key: string]: any }>({})
  const [residentFound, setResidentFound] = useState<boolean | null>(null)

  const getResident = async (phone: string) => {
    if (
      phone.length != 12 ||
      phone.slice(1, phone.length).match(/^[0-9]+$/) == null
    ) {
      setresident({})
      setResidentFound(null)
      return
    }

    const url = `/api/residents?phone=${phone.slice(1, phone.length)}`
    const { rows } = await fetch(url, { cache: "no-store" }).then(
      async (res) => await res.json()
    )
    if (rows.length == 0) {
      setresident({})
      setResidentFound(false)
      return
    }

    setResidentFound(true)
    setresident(rows[0])
  }

  const forceClear = () => {
    setresident({})
    setResidentFound(null)
  }

  return { getResident, resident, residentFound, forceClear }
}
