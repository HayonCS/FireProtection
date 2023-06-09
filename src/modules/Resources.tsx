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

export const Resources: React.FC<{}> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <Typography className={classes.title}>
          {"List of resources for Fire Protection"}
        </Typography>
        <Typography className={classes.linkStyle}>
          <Link
            href="#"
            onClick={() => {
              openInNewTab(
                "https://gentexmi-my.sharepoint.com/:x:/r/personal/alondra_sanchez_gentex_com/Documents/EA%20Fire%20Protection/FP%20Excel%20Sheet.xlsx?d=w93d73badb6d749ceac9a21095a4d50d1&csf=1&web=1&e=bfZK8p"
              );
            }}
          >
            {"FP Excel Sheet"}
          </Link>
        </Typography>
        <Typography className={classes.linkStyle}>
          <Link
            href="#"
            onClick={() => {
              openInNewTab(
                "https://gentexmi.sharepoint.com/:x:/r/sites/ElectricalAssembly/Site%20Documents/James%20St/Continuous%20Improvement/Tally%20Sheet/Southside/Front%20End%20Tally%20Sheet%20(Current%20Week).xlsx?d=wbc0672390b934edca01a8f7816005e5b&csf=1&web=1&e=2S8sXW&nav=MTVfezc2QTRFODc4LTAwNDYtNDhEMy05QkEyLTk0NTc4MDdGQzk0Nn0"
              );
            }}
          >
            {"311T Schedule"}
          </Link>
        </Typography>
        <Typography className={classes.linkStyle}>
          <Link
            href="#"
            onClick={() => {
              openInNewTab(
                "https://lumen.gentex.com/Work%20Standard/Search?line=EA311T"
              );
            }}
          >
            {"Standard Work (VIEWS)"}
          </Link>
        </Typography>
        <Typography className={classes.linkStyle}>
          <Link
            href="#"
            onClick={() => {
              openInNewTab(
                "https://mes.gentex.com/ReportingConfiguration/LineOperationPartCycleTimes?OrgCode=14&Line=EA311T&PartNumber=&EBSOperation=O555&submit=Search"
              );
            }}
          >
            {"Part Cycle Times"}
          </Link>
        </Typography>
      </div>
    </div>
  );
};
