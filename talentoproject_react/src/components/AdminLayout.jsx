import React, { useState } from "react";
import Logo from "../assets/logotalentos.png";
import Notification from "../views/Notification";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Toolbar,
  AppBar,
  Drawer,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as PowerIcon,
  BarChart as ChartBarIcon,
  Work as BriefcaseIcon,
  People as UserCircleIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useStateContext } from "../context/contextprovider";

export default function AdminLayout() {
  const { user, token, setToken, setUser } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Function to determine the page title based on the current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/ManagePost":
        return "Admin Post";
      case "/reports":
        return "Reports";
      case "/ManageBooking":
        return "Manage Bookings";
      case "/CoinRequest":
        return "Coin Requests";
      case "/Performers":
        return "Manage Feedback";
      case "/users":
        return "Users";
      case "/PendingPerformers":
        return "Manage Performer";
      default:
        return "Talento Admin Dashboard";
    }
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle Logout
  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
    setUser(null);
    localStorage.removeItem("USER_DATA");
  };

  // Navigation functions for different sections
  const navigateTo = (route) => {
    navigate(route);
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Sidebar content extracted into a component for reusability
  const SidebarContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <Avatar
          src={Logo}
          alt="Talento Logo"
          sx={{
            width: 50, // Reduced size for compact layout
            height: 50,
            marginRight: 1,
            border: "2px solid #fff",
          }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: "1.2rem", // Reduced font size
            lineHeight: "1.5rem",
            flexGrow: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Welcome <br />
          {user ? user.role : ""} <br />
          {user ? user.name : "Guest"}!
        </Typography>
        {isSmallScreen && (
          <IconButton onClick={toggleSidebar} sx={{ color: "white", ml: "auto" }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
        <List>
          {[
            { text: "Post", icon: <CampaignIcon />, route: "/ManagePost" },
            { text: "Reporting", icon: <ChartBarIcon />, route: "/reports" },
            { text: "Bookings", icon: <BriefcaseIcon />, route: "/ManageBooking" },
            { text: "TalentoCoins", icon: <BriefcaseIcon />, route: "/CoinRequest" },
            { text: "Feedback", icon: <UserCircleIcon />, route: "/Performers" },
            { text: "Users", icon: <UserCircleIcon />, route: "/users" },
            { text: "Performers", icon: <UserCircleIcon />, route: "/PendingPerformers" },
          ].map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={item.route ? () => navigateTo(item.route) : null}
              sx={{
                paddingY: 0.8, // Reduced padding for compact layout
                paddingX: 2,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                borderRadius: "4px",
                marginBottom: "4px", // Reduced spacing between items
                transition: "background-color 0.3s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: "30px", // Reduced size
                  "& > *": {
                    fontSize: "1rem", // Adjusted icon size
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.9rem", // Adjusted font size
                  fontWeight: "bold",
                  color: "white",
                }}
              />
            </ListItem>
          ))}

          {/* Log Out Button */}
          <ListItem
            button
            onClick={onLogout}
            sx={{
              paddingY: 0.8,
              paddingX: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
              marginTop: "4px", // Adjusted spacing
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: "30px",
                "& > *": {
                  fontSize: "1rem",
                },
              }}
            >
              <PowerIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log Out"
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "white",
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar for top navigation with burger menu */}
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(to right, #D97706, #F59E0B)", // Gradient background
          boxShadow: "none",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
            {getPageTitle()}
          </Typography>
          <Notification />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {isSmallScreen ? (
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          sx={{
            "& .MuiDrawer-paper": {
              background: "linear-gradient(to right, #D97706, #F59E0B)", // Matching gradient
              color: "#fff",
              width: 180, // Reduced width
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: isSidebarOpen ? 180 : 0, // Adjusted width
            transition: "width 0.3s ease",
            overflow: "hidden",
            background: "linear-gradient(to right, #D97706, #F59E0B)", // Matching gradient
            color: "#fff",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            paddingTop: "64px", // Height of the AppBar
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isSidebarOpen && !isSmallScreen ? "180px" : 0,
          transition: "margin-left 0.3s ease",
          padding: 3,
        }}
      >
        <Toolbar />
        <Outlet context={{ isSidebarOpen }} />
      </Box>
    </Box>
  );
}


