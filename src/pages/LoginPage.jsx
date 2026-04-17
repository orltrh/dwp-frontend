import { useState } from "react"

import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link
} from "@mui/material"
import { Visibility, VisibilityOff, WifiTethering, Person, Lock } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { API_BASE } from "../config/api"

const styles = {
  leftPanel: {
    width: { xs: "100%", md: "42%" },
    background: "linear-gradient(160deg, #BF360C 0%, #E65100 55%, #FF8F00 100%)",
    display: { xs: "none", md: "flex" },
    flexDirection: "column",
    justifyContent: "flex-end",
    p: 5,
    position: "relative",
    overflow: "hidden"
  },
  decorativeCircle: (s) => ({
    position: "absolute",
    width: s.size,
    height: s.size,
    borderRadius: "50%",
    bgcolor: "rgba(255,255,255,0.07)",
    top: s.top,
    bottom: s.bottom,
    left: s.left,
    right: s.right,
    zIndex: 0
  }),
  brandBox: {
    position: "relative",
    zIndex: 1
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: { xs: 3, md: 6 }
  },
  mobileBrand: {
    display: { xs: "flex", md: "none" },
    alignItems: "center",
    gap: 1,
    mb: 4
  }
}

const DECORATIVE_CIRCLES = [
  { size: 280, top: -80, right: -80 },
  { size: 160, top: 80, left: -40 },
  { size: 120, bottom: 100, right: 40 }
]

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/users?username=${username}&password=${password}`
      )
      const data = await res.json()
      if (data.length === 0) {
        setError("Username atau password salah.")
        setLoading(false)
        return
      }
      login(data[0])
      navigate("/dashboard")
    } catch {
      setError("Tidak dapat terhubung ke server.")
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>

      <Box sx={styles.leftPanel}>
        {DECORATIVE_CIRCLES.map((s, i) => (
          <Box key={i} sx={styles.decorativeCircle(s)} />
        ))}
        <Box sx={styles.brandBox}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <WifiTethering sx={{ color: "#fff", fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
              DataKu
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
            Paket data terjangkau untuk semua
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.rightPanel}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>

          <Box sx={styles.mobileBrand}>
            <WifiTethering sx={{ color: "primary.main", fontSize: 24 }} />
            <Typography variant="h6" fontWeight={700} color="primary.main">DataKu</Typography>
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ color: "#1C1C1C", mb: 0.5, textAlign: "center" }}>
            Masuk ke akun kamu
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 3, textAlign: "center", fontWeight: 300, fontSize: "0.95rem" }}>
            Selamat datang kembali
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box sx={{ textAlign: "right", mt: 1, mb: 3 }}>
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: 13, color: "primary.main" }}
                onClick={(e) => e.preventDefault()}
              >
                Lupa password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.75, mb: 2 }}
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ color: "#aaa" }}>
              Belum punya akun?{" "}
              <Link
                href="#"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: 600 }}
                onClick={(e) => e.preventDefault()}
              >
                Daftar di sini
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

export default LoginPage
