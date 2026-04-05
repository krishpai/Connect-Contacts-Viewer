import React, { useState, useEffect } from "react";
import { apiRequest } from "../authConfig";
import { DateRangeSelector } from "./DateRangeSelector";
import { VMCategory } from "./VMCategory";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useAcquireTokenWithRecovery } from "../hooks/useAcquireTokenWithRecovery";

const API_ENDPOINT_ENTRA_AUTH = import.meta.env.VITE_API_URL_ENTRA_AUTH;
const API_ENDPOINT_CONNECT_AUTH = import.meta.env.VITE_API_URL_CONNECT_AUTH;

interface SearchBoxProps 
{
  region: string;
  entraAuth: boolean;
  onSearchResultChange: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ region, entraAuth, onSearchResultChange }) => {

  const [vmCategory, setVMCategory] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchFailed, setSearchFailed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const acquireTokenWithRecovery = useAcquireTokenWithRecovery();

  const searchClicked = async () => {
    setLoading(true);
    setSearchFailed(false);

          
    let apiUrl;

    if(entraAuth)
      apiUrl = `${API_ENDPOINT_ENTRA_AUTH}?function_code=fetch_voice_messages&vmx3_region=${vmCategory}&start_date=${startDate}&end_date=${endDate}`;
    else
      apiUrl = `${API_ENDPOINT_CONNECT_AUTH}?function_code=fetch_voice_messages&vmx3_region=${vmCategory}&start_date=${startDate}&end_date=${endDate}`;
    
    console.log("apiUrl: " + apiUrl)
    let accessToken: string = "none";

    try 
    {
      if(entraAuth)
      {
        const authResult = await acquireTokenWithRecovery({
          ...apiRequest
        });
        accessToken = authResult?.accessToken ?? "none";
      }

      if (accessToken) 
      {
        const response = await fetch(apiUrl, { 
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        if (!response.ok) 
        {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.matched_objects_count > 0) 
        {
          onSearchResultChange(JSON.stringify(data));
        }
        else 
        {
          setSearchFailed(true);
          onSearchResultChange("");
        }
      }
    } 
    catch (e) 
    {
      console.log(e);
      onSearchResultChange("");
    } 
    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (region) {
      setVMCategory(region);
    }
  }, [region]);

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "1000px", // Limits the spread on ultra-wide monitors
        margin: "0 auto",   // Centers the entire component on the screen
        p: 3 
      }}
    >
      
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={4} 
        alignItems="flex-start" 
        justifyContent="center"
        sx={{ width: "100%", mb: 4 }}
      >
        <DateRangeSelector 
          onStartDateChange={(val) => setStartDate(val)} 
          onEndDateChange={(val) => setEndDate(val)} 
        />
        
        {( region === "ALL" || region == "") && (<VMCategory 
            vmCategory={vmCategory} 
            onVMCategoryChange={(val) => setVMCategory(val)} 
          />)
        }
       
      </Stack>

      {/* Bottom Section: Action Button & Feedback 
      */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          textAlign: "center" 
        }}
      >
        <Button 
          variant="contained" 
          size="large"
          onClick={searchClicked} 
          disabled={loading}
          sx={{ minWidth: "150px", borderRadius: "8px" }}
        >
          {loading ? "Fetching..." : "Retrieve Messages"}
        </Button>

        {loading && (
          <Typography sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}>
            Please wait, communicating with server...
          </Typography>
        )}

        {!loading && searchFailed && (
          <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>
            No voice messages found for the selected criteria.
          </Typography>
        )}
      </Box>
    </Box>
  );
};