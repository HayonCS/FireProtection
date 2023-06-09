import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  makeStyles,
  Paper,
  Popover,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { getHHMMSS } from "../utils/DateUtility";
import {
  ManualBuildDataAll,
  ManualBuildDataStation,
  WaveDataRows,
} from "../utils/DataTypes";
import { getFinalStats } from "../utils/DataUtility";
import { MenuBar } from "../modules/MenuBar";
import { useLocation } from "react-router-dom";
import {
  DataGrid,
  GridColumns,
  GridFooter,
  GridFooterContainer,
} from "@mui/x-data-grid";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

const headers = new Headers();
headers.append("Content-Type", "application/json");
const options: RequestInit = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

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
  paperStyle1: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "calc(100vh - 98px)",
    borderTop: "2px solid rgba(0, 0, 0, 0.3)",
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
  cellStyle: {
    padding: "none",
    alignItems: "left",
    color: "black",
    fontSize: "16px",
    fontFamily: "inherit",
    fontWeight: "bold",
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

export const Stats: React.FC<{}> = (p) => {
  document.title = "Stats | Fire Protection";

  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);

  const [tabValueWave, setTabValueWave] = React.useState(0);
  const [tabValueMB, setTabValueMB] = React.useState(0);

  const [pageWave, setPageWave] = React.useState(0);
  const [rowsPerPageWave, setRowsPerPageWave] = React.useState<number>(100);
  const handleChangeRowsPerPageWave = (pageSize: number) => {
    setRowsPerPageWave(pageSize);
    setPageWave(0);
  };

  const [pageMBAll, setPageMBAll] = React.useState(0);
  const [rowsPerPageMBAll, setRowsPerPageMBAll] = React.useState<number>(100);
  const handleChangeRowsPerPageMBAll = (pageSize: number) => {
    setRowsPerPageMBAll(pageSize);
    setPageMBAll(0);
  };

  const [pageMB1, setPageMB1] = React.useState(0);
  const [rowsPerPageMB1, setRowsPerPageMB1] = React.useState<number>(100);
  const handleChangeRowsPerPageMB1 = (pageSize: number) => {
    setRowsPerPageMB1(pageSize);
    setPageMB1(0);
  };

  const [checkboxDateWave, setCheckboxDateWave] = React.useState(false);
  const [startDateWave, setStartDateWave] = React.useState(new Date());
  const [endDateWave, setEndDateWave] = React.useState(new Date());

  const [checkboxDateMBAll, setCheckboxDateMBAll] = React.useState(false);
  const [startDateMBAll, setStartDateMBAll] = React.useState(new Date());
  const [endDateMBAll, setEndDateMBAll] = React.useState(new Date());

  const [checkboxDateMB1, setCheckboxDateMB1] = React.useState(false);
  const [startDateMB1, setStartDateMB1] = React.useState(new Date());
  const [endDateMB1, setEndDateMB1] = React.useState(new Date());

  const [selectedRowDataWave, setSelectedRowDataWave] = React.useState<
    (WaveDataRows | undefined)[]
  >([]);

  const [selectedRowDataMBAll, setSelectedRowDataMBAll] = React.useState<
    (ManualBuildDataAll | undefined)[]
  >([]);

  const [selectedRowDataMB1, setSelectedRowDataMB1] = React.useState<
    (ManualBuildDataStation | undefined)[]
  >([]);

  const [averageWave, setAverageWave] = React.useState("0%");

  React.useEffect(() => {
    let work = 0;
    let goal = 0;
    selectedRowDataWave.forEach((row) => {
      if (row) {
        work += row.workActual;
        goal += row.workGoal;
      }
    });
    const efficiency =
      work > 0 ? Math.round((goal / work) * 10000) / 100 + "%" : "0%";
    setAverageWave(efficiency);
  }, [selectedRowDataWave]);

  const loadWaveStats = () => {
    console.log("Loading Data...");
    setLoading(true);
    const dateStart =
      startDateWave.getFullYear() +
      "-" +
      (startDateWave.getMonth() < 9 ? "0" : "") +
      (startDateWave.getMonth() + 1) +
      "-" +
      (startDateWave.getDate() < 10 ? "0" : "") +
      startDateWave.getDate();
    const dateEnd =
      endDateWave.getFullYear() +
      "-" +
      (endDateWave.getMonth() < 9 ? "0" : "") +
      (endDateWave.getMonth() + 1) +
      "-" +
      (endDateWave.getDate() < 10 ? "0" : "") +
      endDateWave.getDate();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_Wave/wave_stats/${dateStart}/${
        checkboxDateWave ? dateStart : dateEnd
      }`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const rawData: WaveDataRows[] = json.map((row: any) => {
              return {
                id: row[0],
                date: new Date(row[1] + " " + row[2]),
                timeStart: new Date(row[1] + " " + row[2]),
                timeEnd: new Date(row[1] + " " + row[2]),
                shift: row[3],
                part: row[4],
                board: row[5],
                recipe: row[6],
                pallets: row[7],
                parts: row[8],
                palletsTotal: row[9],
                partsTotal: row[10],
                partTypes: row[11],
                cycleGoal: row[12],
                cycleLast: row[13],
                workActual: row[14],
                workGoal: row[15],
                workActualTotal: row[16],
                workGoalTotal: row[17],
                efficiency: row[18],
                efficiencyTotal: row[19],
                changeover: row[20],
                downtime: row[21],
              } as WaveDataRows;
            });
            const finalData: WaveDataRows[] = getFinalStats(rawData);
            setRowsWave(finalData);
          });
        } else {
          console.log("FAIL");
        }
        setLoading(false);
      })
      .finally(() => {
        //console.log("DONE");
        setLoading(false);
      });
  };

  const loadStatsMBAll = () => {
    console.log("Loading Data...");
    setLoading(true);
    const dateStart =
      startDateMBAll.getFullYear() +
      "-" +
      (startDateMBAll.getMonth() < 9 ? "0" : "") +
      (startDateMBAll.getMonth() + 1) +
      "-" +
      (startDateMBAll.getDate() < 10 ? "0" : "") +
      startDateMBAll.getDate();
    const dateEnd =
      endDateMBAll.getFullYear() +
      "-" +
      (endDateMBAll.getMonth() < 9 ? "0" : "") +
      (endDateMBAll.getMonth() + 1) +
      "-" +
      (endDateMBAll.getDate() < 10 ? "0" : "") +
      endDateMBAll.getDate();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_MB/station_all/${dateStart}/${
        checkboxDateMBAll ? dateStart : dateEnd
      }`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const rawData: ManualBuildDataAll[] = json.map((row: any) => {
              return {
                id: row[0],
                date: new Date(row[1] + " " + row[2]),
                time: new Date(row[1] + " " + row[2]),
                shift: row[3],
                station: row[4],
                part: row[5],
                count: row[6],
                cycle: row[7],
              } as ManualBuildDataAll;
            });
            //const finalData: ManualBuildDataAll[] = getFinalStats(rawData);
            setRowsMBAll(rawData);
          });
        } else {
          console.log("FAIL");
        }
        setLoading(false);
      })
      .finally(() => {
        //console.log("DONE");
        setLoading(false);
      });
  };

  const loadStatsMB1 = () => {
    console.log("Loading Data...");
    setLoading(true);
    const dateStart =
      startDateMB1.getFullYear() +
      "-" +
      (startDateMB1.getMonth() < 9 ? "0" : "") +
      (startDateMB1.getMonth() + 1) +
      "-" +
      (startDateMB1.getDate() < 10 ? "0" : "") +
      startDateMB1.getDate();
    const dateEnd =
      endDateMB1.getFullYear() +
      "-" +
      (endDateMB1.getMonth() < 9 ? "0" : "") +
      (endDateMB1.getMonth() + 1) +
      "-" +
      (endDateMB1.getDate() < 10 ? "0" : "") +
      endDateMB1.getDate();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_MB/station_1/${dateStart}/${
        checkboxDateMB1 ? dateStart : dateEnd
      }`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const rawData: ManualBuildDataStation[] = json.map((row: any) => {
              return {
                id: row[0],
                date: new Date(row[1] + " " + row[2]),
                time: new Date(row[1] + " " + row[2]),
                shift: row[3],
                part: row[4],
                count: row[5],
                cycle: row[6],
              } as ManualBuildDataStation;
            });
            //const finalData: ManualBuildDataAll[] = getFinalStats(rawData);
            setRowsMB1(rawData);
          });
        } else {
          console.log("FAIL");
        }
        setLoading(false);
      })
      .finally(() => {
        //console.log("DONE");
        setLoading(false);
      });
  };

  const [rowsWave, setRowsWave] = React.useState<WaveDataRows[]>([]);

  const [rowsMBAll, setRowsMBAll] = React.useState<ManualBuildDataAll[]>([]);

  const [rowsMB1, setRowsMB1] = React.useState<ManualBuildDataStation[]>([]);

  const columnsWave: GridColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "timeStart",
      headerName: "Start Time",
      width: 150,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "timeEnd",
      headerName: "End Time",
      width: 140,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "part",
      headerName: "Part Number",
      width: 160,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "board",
      headerName: "PCB",
      flex: 1,
      hide: true,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "recipe",
      headerName: "Recipe",
      flex: 1,
      hide: true,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "pallets",
      headerName: "Pallets",
      width: 120,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "parts",
      headerName: "Parts",
      width: 120,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "cycleGoal",
      headerName: "Cycle Goal",
      width: 150,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
    {
      field: "workActual",
      headerName: "Work (Actual)",
      width: 170,
      renderCell: function cellDisplay(cellValue: any) {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "workGoal",
      headerName: "Work (Goal)",
      width: 160,
      renderCell: function cellDisplay(cellValue: any) {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "efficiency",
      headerName: "Efficiency",
      width: 180,
      renderCell: function cellDisplay(cellValue: any) {
        const label =
          (Math.round(cellValue.value * 100) / 100).toFixed(2) + "%";
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "changeover",
      headerName: "Changeover",
      flex: 1,
      renderCell: function cellDisplay(cellValue: any) {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
    {
      field: "downtime",
      headerName: "Downtime",
      flex: 1,
      hide: true,
      renderCell: function cellDisplay(cellValue: any) {
        const label = getHHMMSS(cellValue.value);
        return <div className={classes.cellStyle}>{label}</div>;
      },
    },
  ];

  const columnsMBAll: GridColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "time",
      headerName: "Time",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "station",
      headerName: "Station",
      width: 125,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "part",
      headerName: "Part Number",
      width: 160,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "count",
      headerName: "Count",
      width: 120,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "cycle",
      headerName: "Cycle",
      width: 150,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
  ];

  const columnsMB1: GridColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "time",
      headerName: "Time",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {cellValue.value.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 110,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "part",
      headerName: "Part Number",
      width: 160,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "count",
      headerName: "Count",
      width: 120,
      renderCell: function cellDisplay(cellValue: any) {
        return <div className={classes.cellStyle}>{cellValue.value}</div>;
      },
    },
    {
      field: "cycle",
      headerName: "Cycle",
      width: 150,
      renderCell: function cellDisplay(cellValue: any) {
        return (
          <div className={classes.cellStyle}>
            {(Math.round(cellValue.value * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
  ];

  function CustomFooterWave() {
    return (
      <GridFooterContainer style={{ justifyContent: "right" }}>
        {selectedRowDataWave.length > 0 && (
          <Typography style={{ paddingRight: "20px", fontWeight: "bold" }}>
            {"Efficiency: " + averageWave}
          </Typography>
        )}
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
                disabled={selectedRowDataWave.length < 1}
              >
                Calculate
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <Box p={4}>
                  <Typography>{"Efficiency: " + averageWave}</Typography>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
        <GridFooter style={{ border: "none" }} />
      </GridFooterContainer>
    );
  }

  function CustomFooterMBAll() {
    return (
      <GridFooterContainer style={{ justifyContent: "right" }}>
        {selectedRowDataWave.length > 0 && (
          <Typography style={{ paddingRight: "20px", fontWeight: "bold" }}>
            {"Efficiency: " + averageWave}
          </Typography>
        )}
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
                disabled={selectedRowDataWave.length < 1}
              >
                Calculate
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <Box p={4}>
                  <Typography>{"Efficiency: " + averageWave}</Typography>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
        <GridFooter style={{ border: "none" }} />
      </GridFooterContainer>
    );
  }

  function CustomFooterMB1() {
    return (
      <GridFooterContainer style={{ justifyContent: "right" }}>
        {selectedRowDataWave.length > 0 && (
          <Typography style={{ paddingRight: "20px", fontWeight: "bold" }}>
            {"Efficiency: " + averageWave}
          </Typography>
        )}
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
                disabled={selectedRowDataWave.length < 1}
              >
                Calculate
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <Box p={4}>
                  <Typography>{"Efficiency: " + averageWave}</Typography>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>
        <GridFooter style={{ border: "none" }} />
      </GridFooterContainer>
    );
  }

  return (
    <div className={classes.root}>
      <MenuBar />
      <Backdrop
        open={false}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1,
          flexDirection: "column",
          marginTop: "48px",
        }}
      >
        <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
        <Typography>Loading...</Typography>
      </Backdrop>
      <Paper className={classes.paperStyle}>
        <div className={classes.gridLayout}>
          <Paper className={classes.tabBar}>
            <Tabs
              value={tabValueWave}
              onChange={(event, newValue) => {
                setTabValueWave(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label={"Wave Stats"}
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
            index={tabValueWave}
            onChangeIndex={(index) => {
              setTabValueWave(index);
            }}
            containerStyle={{ width: "100%", height: "100%" }}
            slideStyle={{ width: "100%", height: "100%" }}
          >
            <TabPanel value={tabValueWave} index={0}>
              <div style={{ cursor: "default", padding: "0 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={checkboxDateWave}
                        onChange={(event) => {
                          setCheckboxDateWave(event.target.checked);
                        }}
                      />
                    }
                    labelPlacement="start"
                    label={
                      <Typography variant="body1" style={{ fontSize: "14px" }}>
                        {"Single Date"}
                      </Typography>
                    }
                    style={{ padding: "4px 30px 0 0" }}
                  />

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-start"
                      label="Start"
                      value={startDateWave}
                      onChange={(date: any) => {
                        setStartDateWave(date ?? new Date());
                      }}
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      style={{ width: "150px", marginTop: "8px" }}
                    />
                    <Typography
                      variant="body1"
                      component={"span"}
                      style={{ padding: "10px 20px 0 20px" }}
                    >
                      {"- to -"}
                    </Typography>
                    <KeyboardDatePicker
                      disableToolbar={true}
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-start"
                      label="End"
                      value={endDateWave}
                      onChange={(date: any) => {
                        setEndDateWave(date ?? new Date());
                      }}
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      style={{ width: "150px", marginTop: "8px" }}
                      disabled={checkboxDateWave}
                    />
                  </MuiPickersUtilsProvider>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      loadWaveStats();
                    }}
                    style={{ marginLeft: "50px" }}
                  >
                    GET
                  </Button>
                </div>

                <Paper>
                  <div style={{ height: "calc(100vh - 200px)" }}>
                    <DataGrid
                      columns={columnsWave}
                      rows={rowsWave}
                      pagination={true}
                      rowHeight={40}
                      loading={loading}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      page={pageWave}
                      pageSize={rowsPerPageWave}
                      onPageChange={(newPage) => setPageWave(newPage)}
                      onPageSizeChange={handleChangeRowsPerPageWave}
                      rowCount={rowsWave.length}
                      checkboxSelection={true}
                      onSelectionModelChange={(ids) => {
                        const selectedRowData = ids.map((id) =>
                          rowsWave.find((row) => row.id === id)
                        );
                        setSelectedRowDataWave(selectedRowData);
                      }}
                      components={{ Footer: CustomFooterWave }}
                    />
                  </div>
                </Paper>
              </div>
            </TabPanel>
            <TabPanel value={tabValueWave} index={1}>
              <Paper className={classes.paperStyle1}>
                <div className={classes.gridLayout}>
                  <Paper className={classes.tabBar}>
                    <Tabs
                      value={tabValueMB}
                      onChange={(event, newValue) => {
                        setTabValueMB(newValue);
                      }}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                    >
                      <Tab
                        label={"All Stations"}
                        className={classes.tabStyle}
                        {...a11yProps(0)}
                      />
                      <Tab
                        label="Station 1"
                        className={classes.tabStyle}
                        {...a11yProps(1)}
                      />
                      <Tab
                        label="Station 2"
                        className={classes.tabStyle}
                        {...a11yProps(2)}
                      />
                      <Tab
                        label="Station 3"
                        className={classes.tabStyle}
                        {...a11yProps(3)}
                      />
                      <Tab
                        label="Station 4"
                        className={classes.tabStyle}
                        {...a11yProps(4)}
                      />
                      <Tab
                        label="Station 5"
                        className={classes.tabStyle}
                        {...a11yProps(5)}
                      />
                      <Tab
                        label="Station 6"
                        className={classes.tabStyle}
                        {...a11yProps(6)}
                      />
                    </Tabs>
                  </Paper>
                  <SwipeableViews
                    className={classes.swipeableView}
                    axis={"x"}
                    index={tabValueMB}
                    onChangeIndex={(index) => {
                      setTabValueMB(index);
                    }}
                    containerStyle={{ width: "100%", height: "100%" }}
                    slideStyle={{ width: "100%", height: "100%" }}
                  >
                    <TabPanel value={tabValueMB} index={0}>
                      <div style={{ cursor: "default", padding: "0 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={checkboxDateMBAll}
                                onChange={(event) => {
                                  setCheckboxDateMBAll(event.target.checked);
                                }}
                              />
                            }
                            labelPlacement="start"
                            label={
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {"Single Date"}
                              </Typography>
                            }
                            style={{ padding: "4px 30px 0 0" }}
                          />

                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar={true}
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-start"
                              label="Start"
                              value={startDateMBAll}
                              onChange={(date: any) => {
                                setStartDateMBAll(date ?? new Date());
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              style={{ width: "150px", marginTop: "8px" }}
                            />
                            <Typography
                              variant="body1"
                              component={"span"}
                              style={{ padding: "10px 20px 0 20px" }}
                            >
                              {"- to -"}
                            </Typography>
                            <KeyboardDatePicker
                              disableToolbar={true}
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-start"
                              label="End"
                              value={endDateMBAll}
                              onChange={(date: any) => {
                                setEndDateMBAll(date ?? new Date());
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              style={{ width: "150px", marginTop: "8px" }}
                              disabled={checkboxDateMBAll}
                            />
                          </MuiPickersUtilsProvider>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(event) => {
                              loadStatsMBAll();
                            }}
                            style={{ marginLeft: "50px" }}
                          >
                            GET
                          </Button>
                        </div>

                        <Paper>
                          <div style={{ height: "calc(100vh - 250px)" }}>
                            <DataGrid
                              columns={columnsMBAll}
                              rows={rowsMBAll}
                              pagination={true}
                              rowHeight={40}
                              loading={loading}
                              rowsPerPageOptions={[10, 25, 50, 100]}
                              page={pageMBAll}
                              pageSize={rowsPerPageMBAll}
                              onPageChange={(newPage) => setPageMBAll(newPage)}
                              onPageSizeChange={handleChangeRowsPerPageMBAll}
                              rowCount={rowsMBAll.length}
                              checkboxSelection={true}
                              onSelectionModelChange={(ids) => {
                                const selectedRowData = ids.map((id) =>
                                  rowsMBAll.find((row) => row.id === id)
                                );
                                setSelectedRowDataMBAll(selectedRowData);
                              }}
                              components={{ Footer: CustomFooterMBAll }}
                            />
                          </div>
                        </Paper>
                      </div>
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={1}>
                      <div style={{ cursor: "default", padding: "0 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={checkboxDateMB1}
                                onChange={(event) => {
                                  setCheckboxDateMB1(event.target.checked);
                                }}
                              />
                            }
                            labelPlacement="start"
                            label={
                              <Typography
                                variant="body1"
                                style={{ fontSize: "14px" }}
                              >
                                {"Single Date"}
                              </Typography>
                            }
                            style={{ padding: "4px 30px 0 0" }}
                          />

                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar={true}
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-start"
                              label="Start"
                              value={startDateMB1}
                              onChange={(date: any) => {
                                setStartDateMB1(date ?? new Date());
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              style={{ width: "150px", marginTop: "8px" }}
                            />
                            <Typography
                              variant="body1"
                              component={"span"}
                              style={{ padding: "10px 20px 0 20px" }}
                            >
                              {"- to -"}
                            </Typography>
                            <KeyboardDatePicker
                              disableToolbar={true}
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-start"
                              label="End"
                              value={endDateMB1}
                              onChange={(date: any) => {
                                setEndDateMB1(date ?? new Date());
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              style={{ width: "150px", marginTop: "8px" }}
                              disabled={checkboxDateMB1}
                            />
                          </MuiPickersUtilsProvider>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(event) => {
                              loadStatsMB1();
                            }}
                            style={{ marginLeft: "50px" }}
                          >
                            GET
                          </Button>
                        </div>

                        <Paper>
                          <div style={{ height: "calc(100vh - 250px)" }}>
                            <DataGrid
                              columns={columnsMB1}
                              rows={rowsMB1}
                              pagination={true}
                              rowHeight={40}
                              loading={loading}
                              rowsPerPageOptions={[10, 25, 50, 100]}
                              page={pageMB1}
                              pageSize={rowsPerPageMB1}
                              onPageChange={(newPage) => setPageMB1(newPage)}
                              onPageSizeChange={handleChangeRowsPerPageMB1}
                              rowCount={rowsMB1.length}
                              checkboxSelection={true}
                              onSelectionModelChange={(ids) => {
                                const selectedRowData = ids.map((id) =>
                                  rowsMB1.find((row) => row.id === id)
                                );
                                setSelectedRowDataMB1(selectedRowData);
                              }}
                              components={{ Footer: CustomFooterMB1 }}
                            />
                          </div>
                        </Paper>
                      </div>
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={2}>
                      <div />
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={3}>
                      <div />
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={4}>
                      <div />
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={5}>
                      <div />
                    </TabPanel>
                    <TabPanel value={tabValueMB} index={6}>
                      <div />
                    </TabPanel>
                  </SwipeableViews>
                </div>
              </Paper>
            </TabPanel>
          </SwipeableViews>
        </div>
      </Paper>
    </div>
  );
};
