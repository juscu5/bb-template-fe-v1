import styled from "@emotion/styled";

interface RootStyleProps {
  minimized?: boolean;
}

export const LSTVPageRootStyle = styled("div")<RootStyleProps>(
  ({ theme, minimized }) => ({
    minHeight: "calc(100vh - 70px)",
    width: "100%",
    marginLeft: minimized ? "90px" : "285px",
    transition: "margin-left 0.3s ease",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  })
);
