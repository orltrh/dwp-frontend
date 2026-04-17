import { useState, useEffect } from "react"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Chip,
  Snackbar,
  Alert
} from "@mui/material"
import {
  Person,
  PhoneAndroid,
  Email,
  LocationOn,
  Edit,
  Save,
  Close
} from "@mui/icons-material"

import { useAuth } from "../context/AuthContext"
import useCustomer from "../hooks/useCustomer"
import { API_BASE } from "../config/api"

const styles = {
  pageRoot: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    maxWidth: 1500
  },
  cardContent: {
    p: 3
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #E65100, #FF8F00)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  avatarHeader: {
    display: "flex",
    alignItems: "center",
    gap: 2.5,
    mb: 3
  },
  activeChip: {
    bgcolor: "#E8F5E9",
    color: "#2E7D32",
    fontWeight: 600,
    mt: 0.75
  },
  divider: {
    borderColor: "#F0E6DC"
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
    py: 2
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 2,
    bgcolor: "#FFF3E0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    mt: 0.25
  },
  phoneRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 0.25
  },
  readOnlyChip: {
    fontSize: 10,
    height: 18,
    bgcolor: "#F5F5F5",
    color: "text.secondary"
  },
  editBtn: {
    borderRadius: 100,
    borderColor: "#F0E6DC",
    color: "primary.main",
    fontWeight: 600
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    mt: 2
  },
  formBtns: {
    display: "flex",
    gap: 1.5,
    mt: 1
  },
  saveBtn: {
    borderRadius: 100,
    flex: 1
  },
  cancelEditBtn: {
    borderRadius: 100,
    borderColor: "#F0E6DC",
    color: "text.secondary",
    flex: 1
  },
  logoutBtn: {
    borderRadius: 100,
    borderColor: "#FFCDD2",
    color: "#D32F2F",
    fontWeight: 600,
    "&:hover": { bgcolor: "#FFEBEE", borderColor: "#D32F2F" }
  }
}

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const { customer, loading } = useCustomer(user.customerId)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", address: "" })

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        email: customer.email || "",
        address: customer.address || ""
      })
    }
  }, [customer])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, address: form.address })
      })
      setEditing(false)
      setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      name: customer?.name || "",
      email: customer?.email || "",
      address: customer?.address || ""
    })
    setEditing(false)
  }

  if (loading) return null

  return (
    <Box sx={styles.pageRoot}>

      <Box>
        <Typography variant="h6" fontWeight={700}>Profil Saya</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Kelola informasi akun kamu
        </Typography>
      </Box>

      <Card elevation={0}>
        <CardContent sx={styles.cardContent}>
          <Box sx={styles.avatarHeader}>
            <Box sx={styles.avatarBox}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#fff" }}>
                {customer?.name?.charAt(0).toUpperCase()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>{customer?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{customer?.phone}</Typography>
              <Chip label="Pelanggan Aktif" size="small" sx={styles.activeChip} />
            </Box>
          </Box>

          <Divider sx={{ ...styles.divider, mb: 1 }} />

          {!editing ? (
            <>
              <Box sx={styles.infoRow}>
                <Box sx={styles.iconBox}>
                  <Person sx={{ fontSize: 18, color: "primary.main" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Nama Lengkap</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
                    {customer?.name}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={styles.divider} />

              <Box sx={styles.infoRow}>
                <Box sx={styles.iconBox}>
                  <PhoneAndroid sx={{ fontSize: 18, color: "primary.main" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Nomor Telepon</Typography>
                  <Box sx={styles.phoneRow}>
                    <Typography variant="body2" fontWeight={600}>{customer?.phone}</Typography>
                    <Chip label="Tidak dapat diubah" size="small" sx={styles.readOnlyChip} />
                  </Box>
                </Box>
              </Box>

              <Divider sx={styles.divider} />

              <Box sx={styles.infoRow}>
                <Box sx={styles.iconBox}>
                  <Email sx={{ fontSize: 18, color: "primary.main" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
                    {customer?.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={styles.divider} />

              <Box sx={styles.infoRow}>
                <Box sx={styles.iconBox}>
                  <LocationOn sx={{ fontSize: 18, color: "primary.main" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Alamat</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
                    {customer?.address || "-"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ ...styles.divider, mb: 2.5 }} />

              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                sx={styles.editBtn}
              >
                Ubah Informasi
              </Button>
            </>
          ) : (
            <Box sx={styles.editForm}>
              <TextField
                label="Nama Lengkap"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                label="Alamat"
                fullWidth
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <Box sx={styles.formBtns}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={styles.saveBtn}
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={handleCancel}
                  sx={styles.cancelEditBtn}
                >
                  Batal
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent sx={styles.cardContent}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            Pengaturan Akun
          </Typography>
          <Button variant="outlined" fullWidth onClick={logout} sx={styles.logoutBtn}>
            Keluar dari Akun
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ borderRadius: 2 }}>
          Profil berhasil diperbarui
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default ProfilePage
