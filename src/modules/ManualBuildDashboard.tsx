import * as React from "react";
import {
  Bar,
  BarChart,
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
import { DataGrid } from "@mui/x-data-grid";
import {
  AssetTestData,
  DashboardGraphData,
  ManualBuildDataAll,
  ManualBuildDataStation,
  WaveData,
} from "../utils/DataTypes";
import {
  Backdrop,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { GentexBlue } from "../styles/theme";
import { getHHMMSS } from "../utils/DateUtility";

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
    marginLeft: "50px",
  },
  divTotals: {
    display: "flex",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    zIndex: 1,
    flexDirection: "column",
    right: "calc(-100vw * 2)",
  },
}));

interface GraphData {
  station: number;
  cycle: number;
  efficiency: number;
  Efficiency: string;
}

export const ManualBuildDashboard: React.FC<{}> = (props) => {
  const classes = useStyles();

  const [waveData, setWaveData] = React.useState<WaveData>({
    id: 1,
    date: new Date(),
    time: new Date(),
    shift: 1,
    part: "123-4567",
    board: "123-0010",
    recipe: "123_456_789.rcp",
    pallets: 9999,
    parts: 9999,
    palletsTotal: 9999,
    partsTotal: 9999,
    partTypes: 3,
    cycleGoal: 26.0,
    cycleLast: 23.4,
    cycleEfficiency: 99,
    workActual: 123.456,
    workGoal: 120.12,
    workActualTotal: 234.56,
    workGoalTotal: 200.12,
    efficiency: 103.12,
    efficiencyTotal: 110.12,
    changeover: 12.33,
    downtime: 2.11,
    aheadPart: 2.333,
    aheadTotal: 4.55,
  });

  const [mbData, setMBData] = React.useState<ManualBuildDataAll[][]>([]);

  const [graphData, setGraphData] = React.useState<GraphData[]>([]);

  const [loading, setLoading] = React.useState(true);

  const retrieveLiveData = () => {
    const request = fetch(
      "http://10.201.20.210:8980/api/get_wave_live",
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const data: WaveData = {
              id: json[0],
              date: new Date(json[1] + " " + json[2]),
              time: new Date(json[1] + " " + json[2]),
              shift: json[3],
              part: json[4],
              board: json[5],
              recipe: json[6],
              pallets: json[7],
              parts: json[8],
              palletsTotal: json[9],
              partsTotal: json[10],
              partTypes: json[11],
              cycleGoal: json[12],
              cycleLast: json[13],
              cycleEfficiency: (json[12] / json[13]) * 100,
              workActual: json[14],
              workGoal: json[15],
              workActualTotal: json[16],
              workGoalTotal: json[17],
              efficiency: json[18],
              efficiencyTotal: json[19],
              changeover: json[20],
              downtime: json[21],
              aheadPart: json[15] - json[14],
              aheadTotal: json[17] - json[16],
            };
            setWaveData(data);
          });
        } else {
          console.log("Failed getting live wave data!");
        }
        //setLoading(false);
      })
      .finally(() => {
        //setLoading(false);
      });
  };

  const getStationData = (station: number) => {
    const newDate = new Date();
    const dateToday =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() < 9 ? "0" : "") +
      (newDate.getMonth() + 1) +
      "-" +
      (newDate.getDate() < 10 ? "0" : "") +
      newDate.getDate();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_MB/station_${station}/${dateToday}/${dateToday}`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const data: ManualBuildDataAll[] = json.map((row: any) => {
              return {
                id: row[0],
                date: new Date(row[1] + " " + row[2]),
                time: new Date(row[1] + " " + row[2]),
                shift: row[3],
                station: station,
                part: row[4],
                count: row[5],
                cycle: row[6],
              } as ManualBuildDataAll;
            });
            //mbData.push(data);
            setMBData([...mbData, data]);
          });
        } else {
          console.log("Failed retrieving graph data!");
        }
      })
      .catch((e) => {
        console.log("Error retrieving graph data!");
        console.error(e);
      })
      .finally(() => {
        //setLoading(false);
      });
  };

  const getStationAverage = (stationData: ManualBuildDataAll[]) => {
    let count = 0;
    let total = 0;
    const dateNow = new Date();
    for (let i = stationData.length - 1; i >= 0; --i) {
      if (stationData[i].cycle > 5 && stationData[i].cycle < 180) {
        if (
          Math.round(
            (((dateNow.getTime() - stationData[i].time.getTime()) % 86400000) %
              3600000) /
              60000
          ) < 1440
        ) {
          total += stationData[i].cycle;
          count++;
        } else {
          break;
        }
      }
      if (
        count > 10 ||
        Math.round(
          (((dateNow.getTime() - stationData[i].time.getTime()) % 86400000) %
            3600000) /
            60000
        ) >= 1440
      ) {
        break;
      }
    }
    return count > 0 ? total / count : 0;
  };

  const retrieveGraphData = () => {
    //setMBData([]);
    getStationData(1);
    getStationData(2);
    getStationData(3);
    getStationData(4);
    getStationData(5);
    getStationData(6);
  };

  React.useEffect(() => {
    const avg1 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 1)) ?? []
    );
    const avg2 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 2)) ?? []
    );
    const avg3 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 3)) ?? []
    );
    const avg4 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 4)) ?? []
    );
    const avg5 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 5)) ?? []
    );
    const avg6 = getStationAverage(
      mbData.find((i) => i.find((a) => a.station === 6)) ?? []
    );
    const goal = waveData.cycleGoal;
    const eff1 = goal > 0 ? Math.round((goal / avg1) * 10000) / 100 : 100;
    const eff2 = goal > 0 ? Math.round((goal / avg2) * 10000) / 100 : 100;
    const eff3 = goal > 0 ? Math.round((goal / avg3) * 10000) / 100 : 100;
    const eff4 = goal > 0 ? Math.round((goal / avg4) * 10000) / 100 : 100;
    const eff5 = goal > 0 ? Math.round((goal / avg5) * 10000) / 100 : 100;
    const eff6 = goal > 0 ? Math.round((goal / avg6) * 10000) / 100 : 100;
    setGraphData([
      {
        station: 1,
        cycle: avg1,
        efficiency: eff1,
        Efficiency: eff1.toFixed(2) + "%",
      },
      {
        station: 2,
        cycle: avg2,
        efficiency: eff2,
        Efficiency: eff2.toFixed(2) + "%",
      },
      {
        station: 3,
        cycle: avg3,
        efficiency: eff3,
        Efficiency: eff3.toFixed(2) + "%",
      },
      {
        station: 4,
        cycle: avg4,
        efficiency: eff4,
        Efficiency: eff4.toFixed(2) + "%",
      },
      {
        station: 5,
        cycle: avg5,
        efficiency: eff5,
        Efficiency: eff5.toFixed(2) + "%",
      },
      {
        station: 6,
        cycle: avg6,
        efficiency: eff6,
        Efficiency: eff6.toFixed(2) + "%",
      },
    ]);
    setLoading(false);
  }, [mbData]);

  React.useEffect(() => {
    console.log(graphData);
  }, [graphData]);

  React.useEffect(() => {
    retrieveLiveData();
    retrieveGraphData();
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      retrieveLiveData();
      retrieveGraphData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.root}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" style={{ marginBottom: "10px" }} />
        <Typography>Loading...</Typography>
      </Backdrop>
      <div className={classes.divTotals}>
        <Typography className={classes.title}>{"Total Pallets:"}</Typography>
        <Typography className={classes.labelData1}>
          {waveData.palletsTotal}
        </Typography>
        <Typography className={classes.title} style={{ paddingLeft: "48px" }}>
          {"Total Parts:"}
        </Typography>
        <Typography className={classes.labelData1}>
          {waveData.partsTotal}
        </Typography>
      </div>
      <div style={{ display: "flex", marginTop: "-20px" }}>
        <Typography className={classes.title}>{"Pallets:"}</Typography>
        <Typography className={classes.labelData1}>
          {waveData.pallets}
        </Typography>
        <Typography className={classes.labelPart}>{waveData.part}</Typography>
      </div>
      <div style={{ display: "flex", marginTop: "-40px" }}>
        <Typography className={classes.title}>{"Parts:"}</Typography>
        <Typography className={classes.labelData1}>{waveData.parts}</Typography>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 210,
          right: "calc(-100vw + 50px)",
        }}
      >
        <div style={{ paddingRight: "80px" }}>
          <div style={{ display: "Flex" }}>
            <Typography className={classes.title}>
              {waveData.efficiency >= 100 ? "Ahead (Part):" : "Behind (Part):"}
            </Typography>
            <Typography
              className={classes.labelData1}
              style={
                waveData.efficiency >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiency >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {getHHMMSS(waveData.aheadPart)}
            </Typography>
          </div>
          <div style={{ display: "Flex", marginTop: "-20px" }}>
            <Typography className={classes.title}>
              {waveData.efficiencyTotal >= 100
                ? "Ahead (Total):"
                : " Behind (Total):"}
            </Typography>
            <Typography
              className={classes.labelData1}
              style={
                waveData.efficiencyTotal >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiencyTotal >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {getHHMMSS(waveData.aheadTotal)}
            </Typography>
          </div>
        </div>
        <div style={{ paddingRight: "80px" }}>
          <div style={{ display: "flex" }}>
            <Typography className={classes.title}>{"Last Cycle:"}</Typography>
            <Typography
              className={classes.labelData1}
              style={
                waveData.cycleEfficiency >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.cycleEfficiency >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {(Math.round(waveData.cycleLast * 100) / 100).toFixed(1)}
            </Typography>
          </div>
          <div style={{ display: "flex", marginTop: "-20px" }}>
            <Typography className={classes.title}>{"Cycle Goal:"}</Typography>
            <Typography
              className={classes.labelData1}
              style={{ color: "#000" }}
            >
              {(Math.round(waveData.cycleGoal * 100) / 100).toFixed(1)}
            </Typography>
          </div>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Typography className={classes.title}>
              {"Efficiency (Part):"}
            </Typography>
            <Typography
              className={classes.labelData1}
              style={
                waveData.efficiency >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiency >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {(Math.round(waveData.efficiency * 100) / 100).toFixed(2) + "%"}
            </Typography>
          </div>
          <div style={{ display: "flex", marginTop: "-20px" }}>
            <Typography className={classes.title}>
              {"Efficiency (Total):"}
            </Typography>
            <Typography
              className={classes.labelData1}
              style={
                waveData.efficiencyTotal >= 95
                  ? { color: "rgb(0, 200, 0)" }
                  : waveData.efficiencyTotal >= 85
                  ? { color: "orange" }
                  : { color: "red" }
              }
            >
              {(Math.round(waveData.efficiencyTotal * 100) / 100).toFixed(2) +
                "%"}
            </Typography>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0 }}>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography className={classes.title}>{"Work (Actual):"}</Typography>
          <Typography
            className={classes.labelData1}
            style={
              waveData.efficiency >= 95
                ? { color: "rgb(0, 200, 0)" }
                : waveData.efficiency >= 85
                ? { color: "orange" }
                : { color: "red" }
            }
          >
            {getHHMMSS(waveData.workActual)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography className={classes.title}>{"Work (Goal):"}</Typography>
          <Typography className={classes.labelData1} style={{ color: "#000" }}>
            {getHHMMSS(waveData.workGoal)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography className={classes.title}>{"Total (Actual):"}</Typography>
          <Typography
            className={classes.labelData1}
            style={
              waveData.efficiencyTotal >= 95
                ? { color: "rgb(0, 200, 0)" }
                : waveData.efficiencyTotal >= 85
                ? { color: "orange" }
                : { color: "red" }
            }
          >
            {getHHMMSS(waveData.workActualTotal)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography className={classes.title}>{"Total (Goal):"}</Typography>
          <Typography className={classes.labelData1} style={{ color: "#000" }}>
            {getHHMMSS(waveData.workGoalTotal)}
          </Typography>
        </div>
        <div style={{ display: "flex", marginBottom: "-20px" }}>
          <Typography className={classes.title}>{"Changeover:"}</Typography>
          <Typography className={classes.labelData1} style={{ color: "#000" }}>
            {getHHMMSS(waveData.changeover)}
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <Typography className={classes.title}>{"Starve Time:"}</Typography>
          <Typography className={classes.labelData1} style={{ color: "#000" }}>
            {getHHMMSS(waveData.downtime)}
          </Typography>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: "calc(-100vw)",
          width: "calc(100vw - 500px)",
          height: "calc(100vh - 500px)",
        }}
      >
        <ResponsiveContainer width="100%">
          <BarChart
            data={graphData}
            margin={{
              right: 100,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis
              dataKey="station"
              stroke="#000"
              interval={0}
              style={{ fontSize: "1rem", color: "black" }}
            >
              <Label value="Station" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis />
            <Tooltip />
            <Bar dataKey="cycle" fill="#8884d8" />
          </BarChart>
          {/* <LineChart data={graphData} margin={{ right: 100 }}>
            <CartesianGrid stroke="#000" strokeDasharray="5 5" />
            <XAxis
              dataKey="timeString"
              //interval={"preserveStartEnd"}
              interval={2}
              stroke="#000"
              style={{ fontSize: "1rem" }}
            >
              <Label value="Time" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis
              stroke="#000"
              style={{ fontSize: "1rem" }}
              domain={[
                0,
                Math.round(
                  Math.max(...graphData.map((o) => o.efficiency)) + 20
                ),
              ]}
            >
              <Label
                value="Efficiency"
                offset={20}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip wrapperStyle={{ fontSize: "1rem" }} itemStyle={{}} />
            <ReferenceLine
              y={100}
              label={{
                value: "100%",
                fontSize: "1rem",
                position: "right",
              }}
              stroke="red"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Line
              dataKey="efficiency"
              stroke="green"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart> */}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
