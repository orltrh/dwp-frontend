import { useState, useEffect } from "react"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Grid
} from "@mui/material"
import {
  Add,
  ArrowForward,
  CheckCircle,
  PhoneAndroid,
  DataUsage,
  AccountBalanceWallet,
  Replay
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import useCustomer from "../hooks/useCustomer"
import { formatPrice, formatDate } from "../utils/format"
import { API_BASE } from "../config/api"
import BuyPackageModal from "../components/BuyPackageModal"

const CARD_MIN_HEIGHT = 180

const styles = {
  gradientCard: {
    background: "linear-gradient(135deg, #E65100 0%, #FF8F00 100%)",
    borderRadius: 3,
    p: 3,
    height: "100%",
    minHeight: CARD_MIN_HEIGHT,
    position: "relative",
    overflow: "hidden"
  },
  decorativeCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: "50%",
    bgcolor: "rgba(255,255,255,0.08)",
    bottom: -30,
    right: -30,
    zIndex: 0
  },
  cardInner: {
    position: "relative",
    zIndex: 1
  },
  cardIconRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1.5
  },
  cardWhiteBtn: {
    bgcolor: "#FFFFFF",
    color: "primary.main",
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 700,
    px: 2,
    "&:hover": { bgcolor: "rgba(255,255,255,0.85)" }
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2
  },
  packageCard: {
    border: "1px solid #F0E6DC",
    borderRadius: 3,
    height: "100%",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(230,81,0,0.15)",
      transform: "translateY(-4px)",
      borderLeft: "3px solid #E65100"
    }
  },
  categoryChip: {
    bgcolor: "#FFF3E0",
    color: "primary.main",
    fontWeight: 600,
    mb: 1.5,
    alignSelf: "flex-start",
    fontSize: 11
  },
  txCard: {
    border: "1px solid #F0E6DC",
    borderRadius: 3,
    transition: "box-shadow 0.2s",
    "&:hover": { boxShadow: "0 2px 12px rgba(230,81,0,0.08)" }
  },
  emptyState: {
    textAlign: "center",
    py: 5,
    border: "1px dashed #F0E6DC",
    borderRadius: 3,
    bgcolor: "#fff"
  },
  successChip: {
    bgcolor: "#E8F5E9",
    color: "#2E7D32",
    fontWeight: 600,
    height: 20,
    fontSize: 11,
    mt: 0.5
  },
  lastPackageCard: {
    background: "linear-gradient(135deg, #FFF3E0, #FFFAF7)",
    border: "1px solid #F0E6DC",
    borderRadius: 3,
    p: 2.5,
    display: "flex",
    alignItems: "center",
    gap: 2
  },
  lastPackageIcon: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    bgcolor: "#FFF3E0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  greetingCard: {
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: "0 4px 20px rgba(230,81,0,0.08)"
    }
  }
}

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { customer } = useCustomer(user.customerId)

  const [packages, setPackages] = useState([])
  const [transactions, setTransactions] = useState([])
  const [lastPackage, setLastPackage] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = async () => {
    const txRes = await fetch(`${API_BASE}/transactions?customerId=${user.customerId}`)
    const txData = await txRes.json()
    return txData.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, txData] = await Promise.all([
          fetch(`${API_BASE}/packages`).then((r) => r.json()),
          fetchTransactions()
        ])

        const pkgMap = {}
        pkgRes.forEach((p) => { pkgMap[p.id] = p })

        setPackages(pkgRes.slice(0, 3))
        setTransactions(txData.slice(0, 3))
        setLastPackage(pkgMap[txData[0]?.packageId] || null)
      } catch (err) {
        console.error(err)
        setError("Gagal memuat data. Pastikan server berjalan.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.customerId])

  const handleBuySuccess = async () => {
    try {
      const txData = await fetchTransactions()
      setTransactions(txData.slice(0, 3))
    } catch (err) {
      console.error(err)
    }
  }

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
        <Skeleton variant="rounded" height={40} width={200} />
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={180} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      <Card
        elevation={0}
        sx={{
          ...styles.greetingCard,
          background: "linear-gradient(135deg, #fff 60%, #FFF3E0 100%)",
          border: "1px solid #F0E6DC",
          borderRadius: 3,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E65100, #FF8F00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
              {customer?.name?.charAt(0).toUpperCase()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Selamat datang kembali
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#1A1A1A" }}>
              {customer?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
              <PhoneAndroid sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {customer?.phone}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Chip
            label="Aktif"
            size="small"
            sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 600 }}
          />
        </Box>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={styles.gradientCard}>
            <Box sx={styles.decorativeCircle} />
            <Box sx={styles.cardInner}>
              <Box sx={styles.cardIconRow}>
                <DataUsage sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  Kuota Aktif
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: "#fff", mb: 0.5, letterSpacing: "-1px" }}>
                {customer?.quota_remaining}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2.5 }}>
                {customer?.active_package} · {customer?.quota_expires_days} hari lagi
              </Typography>
              <Button
                size="small"
                startIcon={<Add sx={{ fontSize: 14 }} />}
                onClick={() => navigate("/packages")}
                sx={styles.cardWhiteBtn}
              >
                Beli Kuota
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={styles.gradientCard}>
            <Box sx={styles.decorativeCircle} />
            <Box sx={styles.cardInner}>
              <Box sx={styles.cardIconRow}>
                <AccountBalanceWallet sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  Sisa Pulsa
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: "#fff", mb: 0.5, letterSpacing: "-1px" }}>
                {formatPrice(customer?.balance)}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2.5 }}>
                Pulsa reguler
              </Typography>
              <Button size="small" startIcon={<Add sx={{ fontSize: 14 }} />} sx={styles.cardWhiteBtn}>
                Isi Pulsa
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {lastPackage && (
        <Box >
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
            Beli Lagi
          </Typography>
          <Box sx={styles.lastPackageCard}>
            <Box sx={styles.lastPackageIcon}>
              <Replay sx={{ fontSize: 20, color: "primary.main" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Chip label={lastPackage.category} size="medium" sx={{ ...styles.categoryChip, mb: 0.5 }} />
              <Typography variant="subtitle2" fontWeight={700}>{lastPackage.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lastPackage.quota} · {lastPackage.duration_days} hari · {formatPrice(lastPackage.price)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => setSelectedPackage(lastPackage)}
              sx={{ flexShrink: 0 }}
            >
              Beli
            </Button>
          </Box>
        </Box>
      )}

      <Box>
        <Box sx={styles.sectionHeader}>
          <Typography variant="subtitle1" fontWeight={700}>Rekomendasi Paket</Typography>
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
            size="small"
            onClick={() => navigate("/packages")}
            sx={{ color: "primary.main", fontSize: 12 }}
          >
            Lihat Semua
          </Button>
        </Box>

        <Grid container spacing={2}>
          {packages.map((pkg) => (
            <Grid size={{ xs: 12, sm: 4 }} key={pkg.id}>
              <Card elevation={0} sx={styles.packageCard}>
                <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Chip label={pkg.category} size="small" sx={styles.categoryChip} />
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    {pkg.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 1.5, fontSize: 12 }}>
                    {pkg.quota} · {pkg.duration_days} hari
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1.5 }}>
                    {formatPrice(pkg.price)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    Beli
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Box sx={styles.sectionHeader}>
          <Typography variant="subtitle1" fontWeight={700}>Riwayat Transaksi</Typography>
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
            size="small"
            onClick={() => navigate("/transactions")}
            sx={{ color: "primary.main", fontSize: 12 }}
          >
            Lihat Semua
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {transactions.length === 0 ? (
            <Box sx={styles.emptyState}>
              <Typography variant="body2" color="text.secondary">
                Belum ada transaksi.
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/packages")}
                sx={{ color: "primary.main", mt: 1, fontSize: 12 }}
              >
                Beli paket pertamamu
              </Button>
            </Box>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} elevation={0} sx={styles.txCard}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{tx.packageName}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(tx.date)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {formatPrice(tx.price)}
                      </Typography>
                      <Chip
                        label="Berhasil"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: "12px !important" }} />}
                        sx={styles.successChip}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      <BuyPackageModal
        open={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        selectedPackage={selectedPackage}
        customer={customer}
        onSuccess={handleBuySuccess}
      />

    </Box>
  )
}

export default DashboardPage
