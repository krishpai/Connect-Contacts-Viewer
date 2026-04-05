import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import logo from "../assets/veradium_logo.png";

interface NavbarProps {
  userName: string;
  region: string;
  companyName: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, region, companyName }) => {
  return (
    <AppBar       position="fixed"      sx={{ backgroundColor: "#1976d2", width: "100%", left: 0, top: 0 }}>
      {/**Toolbar	A layout wrapper.	Provides consistent horizontal padding and a min-height that scales with the screen size (responsive height). */}
      <Toolbar>
        {/* The Box component is a generic container for grouping other components. 
        It's a fundamental building block when working with Material UI—you can think of it as a <div> with extra built-in features, l
        ike access to your app's theme and the sx prop.*/}
        <Box
          component="img"
          src={logo}
          alt="Veradium Logo"
          sx={{
            height: 70,
            marginRight: 2,
          }}
        />

        {/* Fixed variant to h6 */}

        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {companyName} Voice Mail
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">{userName} - {region} </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
