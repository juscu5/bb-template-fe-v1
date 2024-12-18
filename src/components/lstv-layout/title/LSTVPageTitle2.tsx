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
  element?: any;
}

const LSTVPageTitle = ({ title, element }: LSTVProps) => {
  const divEn =
    element.props.children[0] === false && element.props.children[1] === false
      ? false
      : true;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h6"
          fontSize={27}
          marginTop={3}
          marginBottom={3}
          width="100%"
          fontFamily="Poppins"
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              overflow: "auto",
              flexShrink: 0,
              fontFamily: "Poppins",
              fontSize: 14,
            }}
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
            <Typography color="text.primary" fontFamily="Poppins" fontSize={14}>
              {title}
            </Typography>
          </Breadcrumbs>
          {title}
        </Typography>

        <>
          <Stack
            direction="row-reverse"
            alignItems="center"
            justifyContent="space-between"
            marginLeft={4}
            marginTop={1}
          >
            {element?.value === "0" ? "" : element}
          </Stack>
        </>
      </Stack>
    </>
  );
};

export default LSTVPageTitle;
