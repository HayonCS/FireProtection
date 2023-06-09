import * as React from "react";
import {
  Fab,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { MenuBar } from "../modules/MenuBar";
import { Resources } from "../modules/Resources";
import { Build, Dashboard, Equalizer, Home, Info } from "@material-ui/icons";
import { About } from "../modules/About";

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
  tabIndex?: number;
}> = (props) => {
  document.title = "Fire Protection 311T";

  const classes = useStyles();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = React.useState(props.tabIndex ?? 0);

  return (
    <div className={classes.app}>
      <MenuBar />
      <header className={classes.appHeader}>
        <div style={{ cursor: "default", userSelect: "none" }}>
          <Typography style={{ fontSize: "48px", fontWeight: "bold" }}>
            {"Fire Protection🔥"}
          </Typography>
        </div>
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
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Home style={{ marginRight: "4px" }} />
                    Home
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Build style={{ marginRight: "4px" }} />
                    Resources
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Info style={{ marginRight: "4px" }} />
                    About
                  </div>
                }
                className={classes.tabStyle}
                {...a11yProps(2)}
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
              <div style={{ height: "calc(100vh - 260px)" }}>
                <div style={{ height: "30px" }} />
                <Typography
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    cursor: "default",
                    userSelect: "none",
                  }}
                >
                  {"Welcome to Fire Protection!"}
                </Typography>
                <div style={{ height: "60px" }} />
                <Fab
                  variant="extended"
                  color="primary"
                  style={{ transform: "scale(1.25)" }}
                  onClick={() => {
                    navigate("/Stats");
                  }}
                >
                  <Equalizer style={{ paddingRight: "8px" }} />
                  {"STATISTICS"}
                </Fab>
                <div style={{ height: "70px" }} />
                <Fab
                  variant="extended"
                  color="primary"
                  style={{ transform: "scale(1.25)" }}
                  onClick={() => {
                    navigate("/Dashboard");
                  }}
                >
                  <Dashboard style={{ paddingRight: "8px" }} />
                  {"DASHBOARD"}
                </Fab>
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Resources />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <About />
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
