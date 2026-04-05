import React from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from "@mui/material";

interface VMCategoryProps 
{
  vmCategory: string;
  onVMCategoryChange: (value: string) => void;
}

export const VMCategory: React.FC<VMCategoryProps> = ({ 
  vmCategory, 
  onVMCategoryChange 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onVMCategoryChange(event.target.value);
  };

  const globalOptions = [
    { value: "SFL", label: "SFL" },
    { value: "NFL", label: "NFL" },
    { value: "GA",  label: "GA" },
    { value: "CA",  label: "CA" },
    { value: "ALL", label: "ALL" }
  ];

  const BalancedRadio = <Radio sx={{ py: 0.25 }} />;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" sx={{ color: 'primary.main', width: '100%', textAlign: 'left', mb: 1, display: 'block', marginLeft: 12 }}>
        Mailbox
      </FormLabel>
      
      <RadioGroup value={vmCategory} onChange={handleChange} name="vm-category-radio-buttons-group"sx={{ ml: 6 }}>
        <Box sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)",rowGap: 0.3,columnGap: 0,}}>
          {globalOptions.map((option) => (
            <FormControlLabel key={option.value} value={option.value} control={BalancedRadio} label={option.label} sx={{ my: 0 }} />
          ))}
        </Box>       
      </RadioGroup>
    </FormControl>
  );
};