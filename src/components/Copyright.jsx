import React from "react";
import { Typography, Link } from "@material-ui/core";

const Component = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        target="_blank"
        href="https://github.com/longshotdev"
      >
        Vidit
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Component;
