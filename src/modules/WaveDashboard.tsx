import * as React from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WaveData } from "../utils/DataTypes";
import {
  Backdrop,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
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
    marginLeft: "60px",
  },
  divTotals: {
    display: "flex",
  },
}));

interface GraphData {
  time: Date;
  timeString: string;
  efficiency: number;
  Efficiency: string;
}

export const WaveDashboard: React.FC<{}> = (props) => {
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

  const [fullData, setFullData] = React.useState<WaveData[]>([
    {
      id: 1,
      date: new Date(),
      time: new Date(),
      shift: 1,
      part: "000-0000",
      board: "000-0000",
      recipe: "000_000_000.rcp",
      pallets: 9999,
      parts: 9999,
      palletsTotal: 9999,
      partsTotal: 9999,
      partTypes: 3,
      cycleGoal: 22.0,
      cycleLast: 20.4,
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
    },
  ]);

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

  const retrieveGraphData = () => {
    const newDate = new Date();
    const dateToday =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() < 10 ? "0" : "") +
      (newDate.getMonth() + 1) +
      "-" +
      (newDate.getDate() < 10 ? "0" : "") +
      newDate.getDate();
    const request = fetch(
      `http://10.201.20.210:8980/api/311T_Wave/wave_stats/${dateToday}/${dateToday}`,
      options
    );
    request
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          jsonResponse.then((json) => {
            const allData: WaveData[] = json.map((row: any) => {
              return {
                id: row[0],
                date: new Date(row[1] + " " + row[2]),
                time: new Date(row[1] + " " + row[2]),
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
                cycleEfficiency: (row[12] / row[13]) * 100,
                workActual: row[14],
                workGoal: row[15],
                workActualTotal: row[16],
                workGoalTotal: row[17],
                efficiency: row[18],
                efficiencyTotal: row[19],
                changeover: row[20],
                downtime: row[21],
                aheadPart: row[15] - row[14],
                aheadTotal: row[17] - row[16],
              } as WaveData;
            });
            setFullData(allData);
            setLoading(false);
          });
        } else {
          console.log("Failed retrieving graph data!");
        }
        //setLoading(false);
      })
      .finally(() => {
        //setLoading(false);
      });
  };

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

  React.useEffect(() => {
    let gData: GraphData[] = [];
    let allData: WaveData[][] = [];
    for (let i = 0; i < 96; ++i) {
      allData.push([]);
    }
    fullData.forEach((waveData) => {
      const hr = waveData.date.getHours();
      const mins = waveData.date.getMinutes();
      for (let i = 0; i < 24; ++i) {
        if (hr === i) {
          if (mins <= 15) {
            allData[i * 4].push(waveData);
          } else if (mins <= 30) {
            allData[i * 4 + 1].push(waveData);
          } else if (mins <= 45) {
            allData[i * 4 + 2].push(waveData);
          } else {
            allData[i * 4 + 3].push(waveData);
          }
        }
      }
    });
    allData.forEach((waveData) => {
      if (waveData.length > 1) {
        let work =
          waveData[waveData.length - 1].workActual - waveData[0].workActual;
        let goal =
          waveData[waveData.length - 1].workGoal - waveData[0].workGoal;
        let efficiency = (goal / work) * 100;
        let date = waveData[waveData.length - 1].date;
        const mins = date.getMinutes();
        const hours = date.getHours();
        date.setMinutes(((((mins + 7.5) / 15) | 0) * 15) % 60);
        date.setHours((((mins / 105 + 0.5) | 0) + hours) % 24);
        date.setSeconds(0);
        let data: GraphData = {
          time: date,
          timeString: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          efficiency: Math.round(efficiency * 100) / 100,
          Efficiency: (Math.round(efficiency * 100) / 100).toFixed(2) + "%",
        };
        gData.push(data);
      }
    });
    let count = 0;
    for (let i = gData.length - 1; i >= 0; --i) {
      if (gData[i]) {
        if (gData[i].efficiency) {
          ++count;
        }
        if (count > 40) {
          gData.splice(i, 1);
          //++i;
        }
      }
    }
    setGraphData(gData);
  }, [fullData]);

  return (
    <div className={classes.root}>
      <Backdrop
        open={loading}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1,
          flexDirection: "column",
        }}
        id="1"
      >
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
        style={{ display: "flex", position: "absolute", top: 210, right: 50 }}
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
          right: 0,
          width: "calc(100vw - 500px)",
          height: "calc(100vh - 500px)",
        }}
      >
        <ResponsiveContainer width="100%">
          <LineChart data={graphData} margin={{ right: 100 }}>
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
                  Math.max(...graphData.map((o) => o.efficiency)) + 10
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
            {/* <Legend
              verticalAlign="bottom"
              align="left"
              height={36}
              iconSize={12}
              wrapperStyle={{ fontSize: "1rem", marginLeft: "30px" }}
            /> */}
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
