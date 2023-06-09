import * as React from "react";
import { Link, makeStyles, Paper, Typography } from "@material-ui/core";

function openInNewTab(url: string) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
}

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    cursor: "default",
  },
  layout: {
    paddingTop: "30px",
    display: "grid",
    rowGap: "20px",
  },
  linkStyle: {
    fontSize: "18px",
  },
  title: {
    alignSelf: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000",
    paddingRight: "10px",
    paddingBottom: "10px",
  },
  cellStyle: {
    padding: "none",
    alignItems: "left",
    color: "black",
    fontSize: "12px",
    fontFamily: "inherit",
    fontWeight: "bold",
  },
}));

export const About: React.FC<{}> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <Typography className={classes.title}>
          {"About the Fire Protection Web App"}
        </Typography>
      </div>
    </div>
  );
};
