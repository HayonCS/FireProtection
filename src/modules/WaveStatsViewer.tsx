import * as React from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import {
  AssetTestData,
  DashboardGraphData,
  WaveDataRows,
  WaveStats,
} from "../utils/DataTypes";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { GentexBlue } from "../styles/theme";
import { getHHMMSS } from "../utils/DateUtility";
import { getFinalStats } from "../utils/DataUtility";

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
    cursor: "default",
  },
  title: {
    alignSelf: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    paddingRight: "10px",
  },
  cellStyle: {
    padding: "none",
    alignItems: "left",
    color: "black",
    fontSize: "12px",
    fontFamily: "inherit",
    fontWeight: "bold",
  },
  labelData1: {
    alignSelf: "center",
    fontSize: "64px",
    fontWeight: "bold",
    color: "#003BFF",
  },
  labelPart: {
    alignSelf: "center",
    fontSize: "112px",
    fontWeight: "bold",
    color: "#000",
    paddingLeft: "calc(100vw / 2 - 530px)",
    marginTop: "-30px",
  },
  divTotals: {
    display: "flex",
  },
}));

export const WaveStatsViewer: React.FC<{}> = (props) => {
  const classes = useStyles();

  const columns: GridColumns = [
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
      hide: true,
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

  const [waveStats, setWaveStats] = React.useState<WaveStats[]>([
    {
      id: 1,
      date: new Date(),
      shift: 1,
      part: "123-4567",
      board: "280-0199",
      recipe: "123_456_789.rcp",
      pallets: 9999,
      parts: 9999,
      palletsTotal: 9999,
      partsTotal: 9999,
      partTypes: 3,
      cycleGoal: 26.0,
      cycleLast: 23.4,
      workActual: 123.456,
      workGoal: 120.12,
      workActualTotal: 234.56,
      workGoalTotal: 200.12,
      efficiency: 103.12,
      efficiencyTotal: 110.12,
      changeover: 12.33,
      downtime: 2.11,
    },
  ]);

  const [rows, setRows] = React.useState<WaveDataRows[]>([
    {
      id: 1,
      date: new Date(),
      timeStart: new Date(),
      timeEnd: new Date(),
      shift: 1,
      part: "123-4567",
      board: "280-0199",
      recipe: "123_456_789.rcp",
      pallets: 9999,
      parts: 9999,
      palletsTotal: 9999,
      partsTotal: 9999,
      partTypes: 3,
      cycleGoal: 26.0,
      cycleLast: 23.4,
      workActual: 123.456,
      workGoal: 120.12,
      workActualTotal: 234.56,
      workGoalTotal: 200.12,
      efficiency: 103.12,
      efficiencyTotal: 110.12,
      changeover: 12.33,
      downtime: 2.11,
    },
  ]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log("LOADING");
    setLoading(true);
    const newDate = new Date();
    const dateToday =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() < 9 ? "0" : "") +
      (newDate.getMonth() + 1) +
      "-" +
      (newDate.getDay() < 9 ? "0" : "") +
      newDate.getDay();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_Wave/wave_stats/${dateToday}/${dateToday}`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            console.log(json);
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
            setRows(finalData);
          });
        } else {
          console.log("FAIL");
        }
        setLoading(false);
      })
      .finally(() => {
        console.log("DONE");
        setLoading(false);
      });
  }, []);

  return (
    <div className={classes.root}>
      <Paper>
        <div style={{ height: "calc(100vh - 200px)" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pagination={true}
            pageSize={100}
            rowHeight={40}
            loading={loading}
          />
        </div>
      </Paper>
    </div>
  );
};
