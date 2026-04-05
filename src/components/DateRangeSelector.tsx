import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Stack, Typography } from "@mui/material";

interface DateRangeSelectorProps {
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onStartDateChange, onEndDateChange }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (startDate) {
      onStartDateChange(startDate.format("YYYY-MM-DD"));
    }
    if (endDate) {
      onEndDateChange(endDate.format("YYYY-MM-DD"));
    }
    // Added empty dependency array [] to prevent infinite loops and run only once on mount
  }, []); 

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue) {
      onStartDateChange(newValue.format("YYYY-MM-DD"));
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    if (newValue) {
      onEndDateChange(newValue.format("YYYY-MM-DD"));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, pt: 0, mt: 0, border: "0px solid #ccc", borderRadius: 2, maxWidth: 500 }}>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          color="primary"
          sx={{ 
            textAlign: "center", // This centers the text
            width: "100%",       // Ensures it takes up the full width of the Box
            display: "block"      // Ensures block-level behavior for centering
          }}
        >
          Select Date Range
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <DatePicker label="Start Date" value={startDate} onChange={handleStartDateChange} />
          <DatePicker 
            label="End Date" 
            value={endDate} 
            onChange={handleEndDateChange} 
            minDate={startDate ?? undefined} 
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};