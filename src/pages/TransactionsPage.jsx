import { useState, useEffect } from "react"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material"
import { CheckCircle, Schedule, PhoneAndroid, CalendarToday } from "@mui/icons-material"

import { useAuth } from "../context/AuthContext"
import useCustomer from "../hooks/useCustomer"
import { formatPrice, formatDate } from "../utils/format"
import { API_BASE } from "../config/api"

const styles = {
  txCard: {
    border: "1px solid #F0E6DC",
    borderLeft: "3px solid #E65100",
    borderRadius: 3,
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(230,81,0,0.08)",
      transform: "translateY(-1px)"
    }
  },
  txRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2
  },
  txLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 0.75
  },
  txRight: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 0.75,
    flexShrink: 0
  },
  categoryChip: {
    bgcolor: "#FFF3E0",
    color: "primary.main",
    fontWeight: 600,
    height: 20,
    fontSize: 11
  },
  emptyState: {
    textAlign: "center",
    py: 6,
    border: "1px dashed #F0E6DC",
    borderRadius: 3
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.5
  }
}

const getStatusChipSx = (status) => ({
  bgcolor: status === "success" ? "#E8F5E9" : "#FFF8E1",
  color: status === "success" ? "#1B5E20" : "#F57F17",
  fontWeight: 600,
  height: 22,
  fontSize: 11
})

const calcExpiryDate = (dateStr, durationDays) => {
  if (!durationDays) return null
  const d = new Date(dateStr)
  d.setDate(d.getDate() + durationDays)
  return d.toISOString().split("T")[0]
}

const TransactionsPage = () => {
  const { user } = useAuth()
  const { customer } = useCustomer(user.customerId)

  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState("Semua")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filters = ["Semua", "Harian", "Mingguan", "Bulanan", "Unlimited"]

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [txRes, pkgRes] = await Promise.all([
          fetch(`${API_BASE}/transactions?customerId=${user.customerId}`),
          fetch(`${API_BASE}/packages`)
        ])
        const [txData, pkgData] = await Promise.all([
          txRes.json(),
          pkgRes.json()
        ])

        const pkgMap = {}
        pkgData.forEach((p) => { pkgMap[p.id] = p })

        const merged = txData
          .map((tx) => ({ ...tx, package: pkgMap[tx.packageId] || null }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        setTransactions(merged)
        setFiltered(merged)
      } catch (err) {
        console.error(err)
        setError("Gagal memuat transaksi. Pastikan server berjalan.")
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [user.customerId])

  useEffect(() => {
    if (filter === "Semua") {
      setFiltered(transactions)
    } else {
      setFiltered(transactions.filter((tx) => tx.package?.category === filter))
    }
  }, [filter, transactions])

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error" variant="body2">{error}</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rounded" height={48} width={320} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" height={90} />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      <Box>
        <Typography variant="h6" fontWeight={700}>Riwayat Transaksi</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {transactions.length} transaksi ditemukan
        </Typography>
      </Box>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, val) => val && setFilter(val)}
        sx={{ flexWrap: "wrap", gap: 1 }}
      >
        {filters.map((f) => (
          <ToggleButton key={f} value={f} size="small">{f}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filtered.length === 0 && (
          <Box sx={styles.emptyState}>
            <Typography variant="body2" color="text.secondary">
              Tidak ada transaksi ditemukan.
            </Typography>
          </Box>
        )}

        {filtered.map((tx) => {
          const phone = tx.targetPhone || customer?.phone
          const expiry = tx.expiryDate || calcExpiryDate(tx.date, tx.package?.duration_days)

          return (
            <Card key={tx.id} elevation={0} sx={styles.txCard}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={styles.txRow}>
                  <Box sx={styles.txLeft}>
                    <Typography variant="subtitle2" fontWeight={700}>{tx.packageName}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatDate(tx.date)}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                      {tx.package?.category && (
                        <Chip label={tx.package.category} size="small" sx={styles.categoryChip} />
                      )}
                      {tx.package && (
                        <Typography variant="caption" color="text.secondary">
                          {tx.package.quota} · {tx.package.duration_days} hari
                        </Typography>
                      )}
                    </Box>
                    {phone && (
                      <Box sx={styles.metaRow}>
                        <PhoneAndroid sx={{ fontSize: 12, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.disabled">{phone}</Typography>
                      </Box>
                    )}
                    {expiry && (
                      <Box sx={styles.metaRow}>
                        <CalendarToday sx={{ fontSize: 12, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.disabled">
                          s/d {formatDate(expiry)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={styles.txRight}>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                      {formatPrice(tx.price)}
                    </Typography>
                    <Chip
                      label={tx.status === "success" ? "Berhasil" : "Pending"}
                      size="small"
                      icon={
                        tx.status === "success"
                          ? <CheckCircle sx={{ fontSize: "12px !important" }} />
                          : <Schedule sx={{ fontSize: "12px !important" }} />
                      }
                      sx={getStatusChipSx(tx.status)}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>

    </Box>
  )
}

export default TransactionsPage
