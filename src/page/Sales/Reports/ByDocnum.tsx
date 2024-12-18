import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
} from "@mui/material";
import { HeaderLabel2 } from "@/models";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import PrintIcon from "@mui/icons-material/Print";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import { useGeneratePDF } from "./hooks/useGeneratePDF";

const ByDocnum = () => {
  const [filters, setFilters] = useState({
    docNoFrom: "",
    docNoTo: "",
    includeCashDoc: false,
    includeNonCashDoc: false,
    includeCancelDoc: false,
    reportOption: "detailed",
  });

  const { account } = useAccountStore();

  // region Fetch Data

  const { data: salesData } = useQuery<any>(
    "sales",

    () =>
      ApiService.get("sales", {
        headers: { Authorization: `Bearer ${account}` },
      }),

    {
      refetchOnWindowFocus: false,
    }
  );

  // #endregion

  const {
    docNoFrom,
    docNoTo,
    includeCashDoc,
    includeNonCashDoc,
    includeCancelDoc,
    reportOption,
  } = filters;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFilters((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // #region Validate input fields

  const isInputValid = docNoFrom !== "" && docNoTo !== "";
  const isDocNoFromError = docNoFrom === "";
  const isDocNoToError = docNoTo === "";

  // #endregion

  // #region Filtered Data

  const filteredData = isInputValid
    ? salesData?.data?.payload

        .filter((item: any) => {
          const docNum = item.docnum;

          return (
            docNum.localeCompare(docNoFrom) >= 0 &&
            docNum.localeCompare(docNoTo) <= 0 &&
            (!includeCashDoc || item.cashdoc === true) &&
            (!includeNonCashDoc || item.cashdoc === false) &&
            (!includeCancelDoc || item.canceldoc === true)
          );
        })

        .map((item: any) => ({
          ...item,

          advdoc: item.advdoc ? "Yes" : "No", // Map boolean to "Yes" or "No"
        }))
    : [];

  // #endregion

  // #region TABLE_HEAD

  const TABLE_HEAD: HeaderLabel2[] = [
    {
      id: "trndte",
      header: "Trans Date",
      size: 100,
      format: " MMMM D, YYYY",
      align: "left", // left | center | right
      type: "date", // text | date | monetary | number | email | password
    },
    {
      id: "docnum",
      header: "Doc No.",
      size: 100,
      align: "left", // left | center | right
      type: "text", // text | date | monetary | number | email | password
    },
    {
      id: "cusdsc",
      header: "Customer Address",
      size: 150,

      align: "left", // left | center | right

      type: "text", // text | date | monetary | number | email | password
    },

    {
      id: "refnum",
      header: "REF No.",
      size: 100,
      align: "left", // left | center | right
      type: "text", // text | date | monetary | number | email | password
    },
    {
      id: "advdoc",
      header: "Advances",
      size: 50,
      align: "left", // left | center | right
      type: "cndn", // text | date | monetary | number | email | password | cndn
      cndntype: 2,
    },

    {
      id: "totamtdisfor",
      header: "Amount",
      size: 100,
      align: "left", // left | center | right
      type: "monetary", // text | date | monetary | number | email | password
      currency: "PHP",
      decimalCnt: 2,
    },
  ];

  // #endregion

  // #region Generate PDF

  const orientation = "landscape";

  const generatePdf = useGeneratePDF(
    filteredData,
    TABLE_HEAD,
    null,
    null,
    docNoFrom,
    docNoTo,
    orientation
  );

  // #endregion

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
          marginRight: "200px",
          // marginTop: "150px",
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
            <Typography>Doc No. From</Typography>
          </Grid>

          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Enter Doc No. From"
              name="docNoFrom"
              value={docNoFrom}
              onChange={handleInputChange}
              error={isDocNoFromError}
              helperText={
                isDocNoFromError ? "Please enter 'Doc No. From'." : ""
              }
            />
          </Grid>

          <Grid item xs={3}>
            <Typography>Doc No. To</Typography>
          </Grid>

          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Enter Doc No. To"
              name="docNoTo"
              value={docNoTo}
              onChange={handleInputChange}
              error={isDocNoToError}
              helperText={isDocNoToError ? "Please enter 'Doc No. To'." : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Document Types</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeCashDoc"
                      checked={includeCashDoc}
                      onChange={handleInputChange}
                    />
                  }
                  label="Include Cash Doc."
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeNonCashDoc"
                      checked={includeNonCashDoc}
                      onChange={handleInputChange}
                    />
                  }
                  label="Include Non-Cash Doc."
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeCancelDoc"
                      checked={includeCancelDoc}
                      onChange={handleInputChange}
                    />
                  }
                  label="Include Cancel Doc. (for summarized format only)"
                />
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="report-options">Report Option</FormLabel>

              <RadioGroup
                row
                aria-labelledby="report-options"
                name="reportOption"
                value={reportOption}
                onChange={handleInputChange}
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
            {isInputValid ? (
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={generatePdf}
              >
                Generate PDF
              </Button>
            ) : (
              <Button variant="contained" startIcon={<PrintIcon />}>
                Print
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </LSTVPageRootStyle>
  );
};

export default ByDocnum;
