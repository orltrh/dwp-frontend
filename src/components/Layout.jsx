import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery
} from "@mui/material"
import {
  Home,
  DataUsage,
  Receipt,
  Person,
  WifiTethering
} from "@mui/icons-material"
import { Outlet, useNavigate, useLocation } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

const NAV_ITEMS = [
  { label: "Beranda", icon: <Home />, path: "/dashboard" },
  { label: "Paket", icon: <DataUsage />, path: "/packages" },
  { label: "Transaksi", icon: <Receipt />, path: "/transactions" },
  { label: "Profil", icon: <Person />, path: "/profile" }
]

const Layout = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const activeIndex = NAV_ITEMS.findIndex(
    (item) => item.path === location.pathname
  )

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>

      {!isMobile && (
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 1px 0 #F0E6DC"
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WifiTethering sx={{ color: "primary.main" }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                DataKu
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? "primary.main" : "text.secondary",
                      fontWeight: isActive ? 700 : 400,
                      borderBottom: isActive ? "2px solid" : "2px solid transparent",
                      borderRadius: 0,
                      px: 2,
                      pb: "6px"
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Button
                onClick={handleLogout}
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "#D32F2F",
                  color: "#fff",
                  borderRadius: 100,
                  fontSize: 12,
                  px: 2,
                  "&:hover": { bgcolor: "#B71C1C" }
                }}
              >
                Keluar
              </Button>
            </Box>

          </Toolbar>
        </AppBar>
      )}

      <Box sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        pb: isMobile ? 10 : 3
      }}>
        <Outlet />
      </Box>

      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000
          }}
        >
          <BottomNavigation
            value={activeIndex}
            onChange={(e, newIndex) => navigate(NAV_ITEMS[newIndex].path)}
            sx={{ bgcolor: "background.paper" }}
          >
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

    </Box>
  )
}

export default Layout
