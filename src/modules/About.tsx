import * as React from "react";
import { makeStyles, Typography } from "@material-ui/core";

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
  title: {
    alignSelf: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    paddingRight: "10px",
    paddingBottom: "10px",
  },
  body: {
    fontSize: "16px",
  },
  contact: {
    fontSize: "16px",
    fontWeight: "bold",
    paddingBottom: "8px",
  },
}));

export const About: React.FC<{}> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <Typography className={classes.title}>
          {"About the Fire Protection App"}
        </Typography>
        <Typography className={classes.body}>
          {
            "This web app for Fire Protection was developed with React 18 and Typescript 4.4.2"
          }
        </Typography>
        <Typography className={classes.body}>
          {
            "It utilizes Material UI React components for UI and Typescript/NodeJS for backend."
          }
        </Typography>
        <Typography className={classes.body}>
          {
            "Fire Protection data is stored in a MySQL server and a REST API is used for queries."
          }
        </Typography>
        <Typography className={classes.body} />
      </div>
      <div style={{ height: "20px" }} />
      <Typography className={classes.contact}>
        {"Questions or concerns please contact me!"}
      </Typography>
      <Typography className={classes.body}>{"Noah Krueger"}</Typography>
      <Typography className={classes.body}>
        {"noah.krueger@gentex.com"}
      </Typography>
      <Typography className={classes.body}>{"Cell: (616) 613-0818"}</Typography>
    </div>
  );
};
