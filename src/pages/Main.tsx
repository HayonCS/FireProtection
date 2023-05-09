import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { MenuBar } from "../modules/MenuBar";

const useStyles = makeStyles(() => ({
  app: {
    textAlign: "center",
  },
  appHeader: {
    backgroundColor: "#282c34",
    height: "144px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  paperStyle: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(100vh - 192px)",
  },
  textField: {
    width: 200,
  },
  gridLayout: {
    display: "grid",
    rowGap: "20px",
    marginBottom: "30px",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "primary",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  formControl: {
    minWidth: 120,
  },
}));

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component={"span"}>{children}</Typography>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const Main: React.FC<{
  parameter?: boolean;
}> = (props) => {
  document.title = "Fire Protection 311T";

  const classes = useStyles();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(0);

  return (
    <div className={classes.app}>
      <MenuBar />
      <header className={classes.appHeader}>
        <h1>Fire Protection</h1>
      </header>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
          <Paper className={classes.tabBar}>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label="Stats"
                className={classes.tabStyle}
                {...a11yProps(0)}
              />
              <Tab
                label="Dashboard"
                className={classes.tabStyle}
                {...a11yProps(1)}
              />
            </Tabs>
          </Paper>
          <SwipeableViews
            axis={"x"}
            index={tabValue}
            onChangeIndex={(index) => {
              setTabValue(index);
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <div style={{ height: "70px" }} />
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  navigate("/Stats");
                }}
              >
                View Statistics
              </Button>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div style={{ height: "70px" }} />
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  navigate("/Dashboard");
                }}
              >
                View Dashboard
              </Button>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
