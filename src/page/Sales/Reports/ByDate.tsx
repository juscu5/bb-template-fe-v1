import React, { useState } from "react";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Grid, Paper, Typography, Button, Orientation } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { HeaderLabel2 } from "@/models";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import dayjs, { Dayjs } from "dayjs";
import PrintIcon from "@mui/icons-material/Print";
import { useGeneratePDF } from "./hooks/useGeneratePDF";
import { SalesItem } from "@/models/sales";

const ByDate = () => {
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [reportOption, setReportOption] = useState("detailed");
  const { account } = useAccountStore();

  const { data: salesData } = useQuery(
    ["sales"],

    async () => {
      return await ApiService.get("sales", {
        headers: { Authorization: `Bearer ${account}` },
      });
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const filteredData = ((salesData?.data?.payload as SalesItem[]) || [])
    .filter((item) => {
      const itemDate = dayjs(item.trndte);
      return (
        (!dateFrom || itemDate.isAfter(dayjs(dateFrom).subtract(1, "day"))) &&
        (!dateTo || itemDate.isBefore(dayjs(dateTo).add(1, "day")))
      );
    })
    .map((item) => ({
      ...item,

      advdoc: item.advdoc ? "Yes" : "No", // Map boolean to "Yes" or "No"
    }))

    .sort((a, b) => (dayjs(a.trndte).isAfter(dayjs(b.trndte)) ? 1 : -1)); // Sort Date

  // Table Head

  const TABLE_HEAD: HeaderLabel2[] = [
    {
      id: "trndte",
      header: "Trans Date",
      size: 100,
      format: "MMMM D, YYYY",
      align: "center",
      type: "date",
    },

    {
      id: "docnum",
      header: "Doc No.",
      size: 100,
      align: "left",
      type: "text",
    },

    {
      id: "cusdsc",
      header: "Customer Address",
      size: 150,
      align: "left",
      type: "text",
    },

    {
      id: "refnum",
      header: "REF No.",
      size: 100,
      align: "left",
      type: "text",
    },

    {
      id: "advdoc",
      header: "Advances",
      size: 50,
      align: "left",
      type: "cndn",
      cndntype: 2,
    },

    {
      id: "totamtdisfor",
      header: "Amount",
      size: 100,
      align: "left",
      type: "monetary",
      currency: "PHP",
      decimalCnt: 2,
    },
  ];

  // #region Validation for Input Fields

  const isFormIncomplete = !dateFrom || !dateTo;
  const dateFromHelperText = dateFrom ? "" : "Date From is required.";
  const dateToHelperText = dateTo ? "" : "Date To is required.";
  const handleDateFromChange = (newValue: Dayjs | null) => {
    setDateFrom(newValue ? newValue.toDate() : null);
  };

  const handleDateToChange = (newValue: Dayjs | null) => {
    setDateTo(newValue ? newValue.toDate() : null);
  };

  // #region Generate PDF

  // const orientation = "landscape";

  const orientation = "portrait";

  const generatePdf = useGeneratePDF(
    filteredData,
    TABLE_HEAD,
    dateFrom,
    dateTo,
    null,
    null,
    orientation
  );

  return (
    <LSTVPageRootStyle
      style={{
        alignItems: "center",
      }}
    >
      <Paper
        variant="elevation"
        component="form"
        elevation={5}
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          width: "50%",
          marginRight: "250px",
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ p: "2rem" }}
        >
          <Grid item xs={3}>
            <Typography>Date From</Typography>
          </Grid>

          <Grid item xs={9}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateFrom ? dayjs(dateFrom) : null}
                onChange={handleDateFromChange}
                sx={{ width: "100%" }}
                slotProps={{
                  textField: {
                    helperText: dateFromHelperText,

                    color: dateFromHelperText ? "warning" : "success",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={3}>
            <Typography>Date To</Typography>
          </Grid>

          <Grid item xs={9}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateTo ? dayjs(dateTo) : null}
                onChange={handleDateToChange}
                sx={{ width: "100%" }}
                slotProps={{
                  textField: {
                    helperText: dateToHelperText,

                    color: dateToHelperText ? "warning" : "success",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="report-options">Report Option</FormLabel>

              <RadioGroup
                row
                aria-labelledby="report-options"
                name="position"
                value={reportOption}
                onChange={(e) => setReportOption(e.target.value)}
              >
                <FormControlLabel
                  value="detailed"
                  control={<Radio />}
                  label="Detailed"
                />

                <FormControlLabel
                  value="summarized"
                  control={<Radio />}
                  label="Summarized"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "right" }}>
            {isFormIncomplete ? (
              <Button variant="contained" startIcon={<PrintIcon />}>
                Print
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={generatePdf}
              >
                Generate PDF
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </LSTVPageRootStyle>
  );
};

export default ByDate;
