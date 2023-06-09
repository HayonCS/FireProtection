import * as React from "react";
import {
  Box,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { MenuBar } from "../modules/MenuBar";
import { WaveDashboard } from "../modules/WaveDashboard";
import { ManualBuildDashboard } from "../modules/ManualBuildDashboard";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
  },
  appHeader: {
    backgroundColor: "#1d222b",
    width: "100%",
    height: "96px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    paddingTop: "0px",
  },
  paperStyle: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "calc(100vh - 48px)",
  },
  tabBar: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  tabStyle: {
    fontWeight: "bolder",
    fontSize: "1rem",
  },
  gridLayout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  swipeableView: {
    height: "calc(100vh - 96px)",
    width: "100%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
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
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
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

export const Dashboard: React.FC<{}> = (p) => {
  document.title = "Dashboard | Fire Protection";

  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);

  React.useEffect(() => {
    console.log("Loading Data...");
  }, []);

  return (
    <div className={classes.root}>
      <MenuBar />
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
                label={"Wave"}
                className={classes.tabStyle}
                {...a11yProps(0)}
              />
              <Tab
                label="Manual Build"
                className={classes.tabStyle}
                {...a11yProps(1)}
              />
            </Tabs>
          </Paper>
          <SwipeableViews
            className={classes.swipeableView}
            axis={"x"}
            index={tabValue}
            onChangeIndex={(index) => {
              setTabValue(index);
            }}
            containerStyle={{ width: "100%", height: "100%" }}
            slideStyle={{ width: "100%", height: "100%" }}
          >
            <TabPanel value={tabValue} index={0}>
              <WaveDashboard />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ManualBuildDashboard />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
