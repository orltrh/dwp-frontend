import { useState, useEffect } from "react"

import { API_BASE } from "../config/api"

const useCustomer = (customerId) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!customerId) return

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${API_BASE}/customers/${customerId}`)
        const data = await res.json()
        setCustomer(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId])

  return { customer, loading, error }
}

export default useCustomer
