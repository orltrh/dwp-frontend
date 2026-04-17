import { useState, useEffect } from "react"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  MenuItem
} from "@mui/material"
import { CheckCircle } from "@mui/icons-material"

import { useAuth } from "../context/AuthContext"
import useCustomer from "../hooks/useCustomer"
import { formatPrice } from "../utils/format"
import { API_BASE } from "../config/api"
import BuyPackageModal from "../components/BuyPackageModal"

const styles = {
  pageRoot: {
    display: "flex",
    flexDirection: "column",
    gap: 3
  },
  errorBox: {
    textAlign: "center",
    py: 8
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  filterRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    flexWrap: "wrap"
  },
  toggleGroup: {
    flexWrap: "wrap",
    gap: 1
  },
  sortSelect: {
    minWidth: 160
  },
  packageCard: {
    border: "1px solid #F0E6DC",
    borderRadius: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(230,81,0,0.15)",
      transform: "translateY(-4px)",
      borderLeft: "3px solid #E65100"
    }
  },
  cardContent: {
    p: 2.5,
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  categoryChip: {
    bgcolor: "#FFF3E0",
    color: "primary.main",
    fontWeight: 600,
    mb: 1.5,
    alignSelf: "flex-start",
    fontSize: 11
  },
  pkgDescription: {
    flex: 1,
    mb: 2,
    fontSize: 13,
    lineHeight: 1.5
  },
  quotaBadge: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    mb: 1.5,
    p: 1.5,
    bgcolor: "#FFFAF7",
    borderRadius: 2,
    border: "1px solid #F0E6DC"
  },
  checkIcon: {
    fontSize: 15,
    color: "#2E7D32"
  },
  emptyState: {
    textAlign: "center",
    py: 6,
    border: "1px dashed #F0E6DC",
    borderRadius: 3
  }
}

const parseQuota = (quota) => {
  if (quota === "Unlimited") return Infinity
  const match = quota.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

const PackagesPage = () => {
  const { user } = useAuth()
  const { customer } = useCustomer(user.customerId)

  const [packages, setPackages] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState("default")
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ["Semua", "Harian", "Mingguan", "Bulanan", "Unlimited"]

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE}/packages`)
        const data = await res.json()
        setPackages(data)
        setFiltered(data)
      } catch (err) {
        console.error(err)
        setError("Gagal memuat paket. Pastikan server berjalan.")
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  useEffect(() => {
    let result = category === "Semua"
      ? [...packages]
      : packages.filter((pkg) => pkg.category === category)

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price)
    else if (sortBy === "quota-desc") result.sort((a, b) => parseQuota(b.quota) - parseQuota(a.quota))

    setFiltered(result)
  }, [category, packages, sortBy])

  if (error) {
    return (
      <Box sx={styles.errorBox}>
        <Typography color="error" variant="body2">{error}</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={styles.loadingBox}>
        <Skeleton variant="rounded" height={48} width={320} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={styles.pageRoot}>

      <Box>
        <Typography variant="h6" fontWeight={700}>Pilih Paket Data</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Temukan paket yang sesuai kebutuhanmu
        </Typography>
      </Box>

      <Box sx={styles.filterRow}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(e, val) => val && setCategory(val)}
          sx={styles.toggleGroup}
        >
          {categories.map((cat) => (
            <ToggleButton key={cat} value={cat} size="small">{cat}</ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField
          select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={styles.sortSelect}
        >
          <MenuItem value="default">Urutkan</MenuItem>
          <MenuItem value="price-asc">Harga Termurah</MenuItem>
          <MenuItem value="price-desc">Harga Termahal</MenuItem>
          <MenuItem value="quota-desc">Kuota Terbesar</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {filtered.map((pkg) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pkg.id}>
            <Card elevation={0} sx={styles.packageCard}>
              <CardContent sx={styles.cardContent}>
                <Chip label={pkg.category} size="small" sx={styles.categoryChip} />
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.pkgDescription}>
                  {pkg.description}
                </Typography>
                <Box sx={styles.quotaBadge}>
                  <CheckCircle sx={styles.checkIcon} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {pkg.quota} · {pkg.duration_days} hari
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
                  {formatPrice(pkg.price)}
                </Typography>
                <Button variant="contained" fullWidth onClick={() => setSelectedPackage(pkg)} sx={{ py: 1 }}>
                  Beli Sekarang
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid size={12}>
            <Box sx={styles.emptyState}>
              <Typography variant="body2" color="text.secondary">
                Tidak ada paket dalam kategori ini.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <BuyPackageModal
        open={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        selectedPackage={selectedPackage}
        customer={customer}
      />

    </Box>
  )
}

export default PackagesPage
