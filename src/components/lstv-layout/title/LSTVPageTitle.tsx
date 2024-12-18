import {
  Box,
  Breadcrumbs,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface LSTVProps {
  title: string;
  element: any;
}

const LSTVPageTitle = ({ title, element }: LSTVProps) => {
  const divEn =
    element.props.children[0] === false && element.props.children[1] === false
      ? false
      : true;

  return (
    <>
      <Paper
        variant="elevation"
        elevation={3}
        sx={{ borderRadius: "10px", marginTop: "15px", width: "100%" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h6"
            fontSize={27}
            margin={1.3}
            marginLeft={4}
            width="100%"
            fontFamily="Poppins"
          >
            {title}
          </Typography>

          <Stack
            direction="row-reverse"
            alignItems="center"
            justifyContent="space-between"
            marginRight={4}
            marginLeft={4}
            sx={{ flex: 1, whiteSpace: "nowrap" }}
          >
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ overflow: "auto", flexShrink: 0, fontFamily: "Poppins" }}
            >
              <Link
                underline="hover"
                color="inherit"
                href="#"
                onClick={(event: any) => event.preventDefault()}
              >
                Home
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href="#"
                onClick={(event: any) => event.preventDefault()}
              >
                Master File
              </Link>
              <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
          </Stack>

          {divEn && (
            <>
              <Divider orientation="vertical" flexItem />

              <Stack
                direction="row-reverse"
                alignItems="center"
                justifyContent="space-between"
                marginRight={4}
                marginLeft={4}
              >
                {element}
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default LSTVPageTitle;
