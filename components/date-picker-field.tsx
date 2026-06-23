"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "./theme-provider";

export function DatePickerField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const [value, setValue] = useState<Date | null>(null);
  const { theme } = useTheme();
  const muiTheme = createTheme({ palette: { mode: theme } });

  return (
    <label className="text-xs uppercase tracking-wider">
      {label}

      <MuiThemeProvider theme={muiTheme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={{
            fieldDayPlaceholder: () => "dd",
            fieldMonthPlaceholder: () => "mm",
            fieldYearPlaceholder: () => "yyyy",
          }}
        >
          <DatePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
            minDate={new Date()}
            format="dd/MM/yyyy"
            slotProps={{
              field: {
                shouldRespectLeadingZeros: true,
              },
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  mt: "0.5rem",
                  "& .MuiInputBase-root": {
                    width: "100%",
                    minHeight: "44px",
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    paddingLeft: "0.75rem",
                    paddingRight: "0.5rem",
                    color: theme === "dark" ? "#f1f0ec" : "#11110f",
                  },
                  "& .MuiPickersSectionList-root": {
                    padding: 0,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    color: theme === "dark" ? "#f1f0ec" : "#11110f",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "dark" ? "#55534d" : "rgb(212 212 212)",
                    borderRadius: 0,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "dark" ? "#f1f0ec" : "rgb(163 163 163)",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "dark" ? "#f1f0ec" : "rgb(23 23 23)",
                    borderWidth: "1px",
                  },
                  "& .MuiIconButton-root": {
                    padding: "4px",
                    marginRight: "-4px",
                    color: theme === "dark" ? "#f1f0ec" : "inherit",
                  },
                },
              },
            }}
          />

          <input
            type="hidden"
            name={name}
            value={value ? format(value, "yyyy-MM-dd") : ""}
          />
        </LocalizationProvider>
      </MuiThemeProvider>
    </label>
  );
}
