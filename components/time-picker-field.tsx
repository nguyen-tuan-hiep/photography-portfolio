"use client";

import { useState } from "react";
import { format } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export function TimePickerField({
  name,
  label,
  minTime,
}: {
  name: string;
  label: string;
  minTime?: Date | null;
}) {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <label className="text-xs uppercase tracking-wider">
      {label}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minTime={minTime ?? undefined}
          ampm={false}
          format="HH:mm"
          slotProps={{
            field: {
              shouldRespectLeadingZeros: true,
            },
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: {
                mt: "0.5rem",

                "& .MuiPickersInputBase-root": {
                  width: "100%",
                  minHeight: "44px",
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  paddingLeft: "0.75rem",
                  paddingRight: "0.5rem",
                },

                "& .MuiPickersSectionList-root": {
                  padding: 0,
                  fontSize: "0.875rem",
                  textTransform: "none",
                },

                "& .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "rgb(212 212 212)",
                  borderRadius: 0,
                },

                "&:hover .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "rgb(163 163 163)",
                },

                "& .Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "rgb(23 23 23)",
                  borderWidth: "1px",
                },

                "& .MuiIconButton-root": {
                  padding: "4px",
                  marginRight: "-4px",
                },
              },
            },
          }}
        />
      </LocalizationProvider>

      <input
        type="hidden"
        name={name}
        value={value ? format(value, "HH:mm") : ""}
      />
    </label>
  );
}
