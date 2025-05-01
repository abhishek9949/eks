import { Backdrop, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 50,
        backgroundColor: "#f4f4f42d",
      }}
      open={true} // Shows loader when navigating
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default Loader;
