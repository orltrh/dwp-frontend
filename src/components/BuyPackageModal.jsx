import { useState, useEffect } from "react"

import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from "@mui/material"
import { CheckCircle, PhoneAndroid } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { formatPrice, formatDate } from "../utils/format"
import { API_BASE } from "../config/api"

const styles = {
  dialogPaper: {
    borderRadius: 3,
    p: 1,
    maxWidth: 480,
    width: "100%"
  },
  confirmBox: {
    bgcolor: "#FFFAF7",
    borderRadius: 2,
    p: 2.5,
    border: "1px solid #F0E6DC"
  },
  confirmChip: {
    bgcolor: "#FFF3E0",
    color: "primary.main",
    fontWeight: 600,
    mb: 1
  },
  quotaRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    mt: 1.5
  },
  phoneEditBox: {
    display: "flex",
    flexDirection: "column",
    gap: 1
  },
  phoneEditBtns: {
    display: "flex",
    gap: 1
  },
  cancelPhoneBtn: {
    flex: 1,
    borderColor: "#F0E6DC",
    color: "text.secondary"
  },
  phoneDisplayRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  phoneInfo: {
    display: "flex",
    alignItems: "center",
    gap: 0.75
  },
  gantiBtn: {
    fontSize: 11,
    color: "primary.main",
    minWidth: 0,
    p: "2px 6px"
  },
  dialogActions: {
    px: 3,
    pb: 2,
    gap: 1
  },
  cancelBtn: {
    flex: 1,
    borderColor: "#F0E6DC",
    color: "text.secondary"
  },
  successContent: {
    textAlign: "center",
    py: 3,
    px: 1
  },
  successIcon: {
    fontSize: 72,
    color: "#2E7D32",
    mb: 2
  },
  summaryBox: {
    bgcolor: "#FFFAF7",
    border: "1px solid #F0E6DC",
    borderRadius: 2,
    p: 2,
    mb: 3,
    textAlign: "left"
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    mb: 1
  },
  summaryRowLast: {
    display: "flex",
    justifyContent: "space-between"
  },
  viewTxBtn: {
    py: 1.25,
    mb: 1.5
  }
}

const isValidPhone = (phone) =>
  /^(08|\+62)\d{7,12}$/.test(phone.replace(/[-\s]/g, ""))

const calcExpiryDate = (durationDays) => {
  const d = new Date()
  d.setDate(d.getDate() + (durationDays ?? 0))
  return d.toISOString().split("T")[0]
}

const BuyPackageModal = ({ open, onClose, selectedPackage, customer, onSuccess }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState("confirm")
  const [buying, setBuying] = useState(false)
  const [targetPhone, setTargetPhone] = useState("")
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState("")
  const [phoneError, setPhoneError] = useState("")

  useEffect(() => {
    if (customer?.phone) {
      setTargetPhone(customer.phone)
      setPhoneInput(customer.phone)
    }
  }, [customer?.phone])

  const handleClose = () => {
    setStep("confirm")
    setEditingPhone(false)
    setPhoneError("")
    onClose()
  }

  const handleConfirmPhone = () => {
    if (!isValidPhone(phoneInput)) {
      setPhoneError("Format tidak valid (contoh: 08xxx atau +62xxx)")
      return
    }
    setTargetPhone(phoneInput)
    setEditingPhone(false)
    setPhoneError("")
  }

  const handleBuy = async () => {
    setBuying(true)
    const expiryDate = calcExpiryDate(selectedPackage.duration_days)
    try {
      await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.customerId,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          price: selectedPackage.price,
          date: new Date().toISOString().split("T")[0],
          targetPhone,
          expiryDate,
          status: "success"
        })
      })
      if (onSuccess) onSuccess()
      setStep("success")
    } catch (err) {
      console.error(err)
    } finally {
      setBuying(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: styles.dialogPaper }}>
      {step === "confirm" ? (
        <>
          <DialogTitle sx={{ fontWeight: 700 }}>Konfirmasi Pembelian</DialogTitle>
          <DialogContent>
            <Box sx={styles.confirmBox}>
              <Chip label={selectedPackage?.category} size="small" sx={styles.confirmChip} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5 }}>
                {selectedPackage?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {selectedPackage?.description}
              </Typography>
              <Box sx={styles.quotaRow}>
                <CheckCircle sx={{ fontSize: 15, color: "#2E7D32" }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {selectedPackage?.quota} · {selectedPackage?.duration_days} hari
                </Typography>
              </Box>

              <Box sx={{ mt: 1.5 }}>
                {editingPhone ? (
                  <Box sx={styles.phoneEditBox}>
                    <TextField
                      label="Nomor HP"
                      size="small"
                      fullWidth
                      value={phoneInput}
                      onChange={(e) => { setPhoneInput(e.target.value); setPhoneError("") }}
                      error={!!phoneError}
                      helperText={phoneError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneAndroid sx={{ fontSize: 16 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Box sx={styles.phoneEditBtns}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => { setEditingPhone(false); setPhoneError("") }}
                        sx={styles.cancelPhoneBtn}
                      >
                        Batal
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleConfirmPhone}
                        sx={{ flex: 1 }}
                      >
                        Konfirmasi
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={styles.phoneDisplayRow}>
                    <Box sx={styles.phoneInfo}>
                      <PhoneAndroid sx={{ fontSize: 15, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {targetPhone}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setEditingPhone(true)}
                      sx={styles.gantiBtn}
                    >
                      Ganti
                    </Button>
                  </Box>
                )}
              </Box>

              <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mt: 2 }}>
                {selectedPackage && formatPrice(selectedPackage.price)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button onClick={handleClose} variant="outlined" sx={styles.cancelBtn}>
              Batal
            </Button>
            <Button
              onClick={handleBuy}
              variant="contained"
              disabled={buying || editingPhone}
              sx={{ flex: 1 }}
            >
              {buying ? "Memproses..." : "Beli Sekarang"}
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <Box sx={styles.successContent}>
            <CheckCircle sx={styles.successIcon} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Pembelian Berhasil!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {selectedPackage?.name} telah aktif untuk
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ mb: 3 }}>
              {targetPhone}
            </Typography>
            <Box sx={styles.summaryBox}>
              <Box sx={styles.summaryRow}>
                <Typography variant="caption" color="text.secondary">Paket</Typography>
                <Typography variant="caption" fontWeight={600}>{selectedPackage?.name}</Typography>
              </Box>
              <Box sx={styles.summaryRow}>
                <Typography variant="caption" color="text.secondary">Kuota</Typography>
                <Typography variant="caption" fontWeight={600}>{selectedPackage?.quota}</Typography>
              </Box>
              <Box sx={styles.summaryRow}>
                <Typography variant="caption" color="text.secondary">Berlaku</Typography>
                <Typography variant="caption" fontWeight={600}>{selectedPackage?.duration_days} hari</Typography>
              </Box>
              <Box sx={styles.summaryRow}>
                <Typography variant="caption" color="text.secondary">Berlaku s/d</Typography>
                <Typography variant="caption" fontWeight={600}>
                  {selectedPackage && formatDate(calcExpiryDate(selectedPackage.duration_days))}
                </Typography>
              </Box>
              <Box sx={styles.summaryRowLast}>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography variant="caption" fontWeight={700} color="primary.main">
                  {selectedPackage && formatPrice(selectedPackage.price)}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => { handleClose(); navigate("/transactions") }}
              sx={styles.viewTxBtn}
            >
              Lihat Transaksi
            </Button>
            <Button variant="text" fullWidth onClick={handleClose} sx={{ color: "text.secondary" }}>
              Kembali ke Beranda
            </Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default BuyPackageModal
