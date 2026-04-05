import React from "react";
import Navbar from "./Navbar";
import Box from "@mui/material/Box";

interface PageLayoutProps {
  userName: string;
  region: string;
  children?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ userName, region, children }) => {
  return (
    <>
      <Navbar userName={userName} region={region} companyName="Veradium" />

      {/* 1. Add top margin to account for the fixed navbar height */}
      <Box
        sx={{
          marginTop: "15px", // Standard Toolbar height + 1px
          width: "100%",
          p: 3,
          // 2. Ensure content area takes up the rest of the height
          minHeight: "calc(100vh - 65px)",
          backgroundColor: "background.default",
        }}
      >
        {children}
      </Box>
    </>
  );
};
