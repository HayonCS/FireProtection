import { WaveDataRows } from "./DataTypes";

export const getFinalStats = (data: WaveDataRows[]) => {
  const finalData: WaveDataRows[] = [];
  let startTime = new Date();
  data.forEach((row, index) => {
    if (index < data.length - 1) {
      if (index === 0) {
        startTime = row.timeStart;
      } else if (
        row.part !== data[index - 1].part ||
        (row.part === data[index - 1].part &&
          row.shift !== data[index - 1].shift) ||
        row.timeEnd.getDate() !== data[index - 1].timeStart.getDate()
      ) {
        startTime = row.timeStart;
      }
      if (row.part !== data[index + 1].part) {
        if (
          finalData.length > 0 &&
          finalData[finalData.length - 1].part === row.part &&
          finalData[finalData.length - 1].shift !== row.shift &&
          row.parts > finalData[finalData.length - 1].parts
        ) {
          let stat = { ...row };
          let match = { ...finalData[finalData.length - 1] };
          stat.timeStart = startTime;
          stat.pallets -= match.pallets;
          stat.parts -= match.parts;
          stat.workActual -= match.workActual;
          stat.workActualTotal -= match.workActualTotal;
          stat.workGoal -= match.workGoal;
          stat.workGoalTotal -= match.workGoalTotal;
          stat.efficiency = (stat.workGoal / stat.workActual) * 100.0;
          stat.efficiencyTotal =
            (stat.workGoalTotal / stat.workActualTotal) * 100.0;
          stat.changeover =
            (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
              3600000) /
            60000;
          finalData.push(stat);
        } else {
          if (
            finalData.length > 0 &&
            ((row.shift === 1 && finalData[finalData.length - 1].shift !== 2) ||
              row.shift === 2)
          ) {
            let stat = { ...row };
            let match = { ...finalData[finalData.length - 1] };
            stat.timeStart = startTime;
            if (stat.timeStart.getDate() === match.timeEnd.getDate()) {
              stat.changeover =
                (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
                  3600000) /
                60000;
            } else {
              stat.changeover = 0;
            }
            finalData.push(stat);
          } else {
            let stat = { ...row };
            stat.timeStart = startTime;
            finalData.push(stat);
          }
        }
      } else if (row.shift !== data[index + 1].shift) {
        if (row.shift === 1) {
          if (
            finalData.length > 0 &&
            finalData[finalData.length - 1].shift !== 2
          ) {
            let stat = { ...row };
            let match = { ...finalData[finalData.length - 1] };
            stat.timeStart = startTime;
            if (stat.timeStart.getDate() === match.timeEnd.getDate()) {
              stat.changeover =
                (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
                  3600000) /
                60000;
            } else {
              stat.changeover = 0;
            }
            finalData.push(stat);
          } else {
            let stat = { ...row };
            stat.timeStart = startTime;
            stat.changeover = 0;
            finalData.push(stat);
          }
        } else {
          if (
            finalData.length > 0 &&
            finalData[finalData.length - 1].part === row.part &&
            finalData[finalData.length - 1].shift !== row.shift &&
            row.parts > finalData[finalData.length - 1].parts
          ) {
            let stat = { ...row };
            let match = { ...finalData[finalData.length - 1] };
            stat.timeStart = startTime;
            stat.pallets -= match.pallets;
            stat.parts -= match.parts;
            stat.workActual -= match.workActual;
            stat.workActualTotal -= match.workActualTotal;
            stat.workGoal -= match.workGoal;
            stat.workGoalTotal -= match.workGoalTotal;
            stat.efficiency = (stat.workGoal / stat.workActual) * 100.0;
            stat.efficiencyTotal =
              (stat.workGoalTotal / stat.workActualTotal) * 100.0;
            stat.changeover =
              (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
                3600000) /
              60000;
            finalData.push(stat);
          } else if (finalData.length > 0) {
            let stat = { ...row };
            let match = { ...finalData[finalData.length - 1] };
            stat.timeStart = startTime;
            if (stat.timeStart.getDate() === match.timeEnd.getDate()) {
              stat.changeover =
                (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
                  3600000) /
                60000;
            } else {
              stat.changeover = 0;
            }
            finalData.push(stat);
          } else {
            let stat = { ...row };
            stat.timeStart = startTime;
            stat.changeover = 0;
            finalData.push(stat);
          }
        }
      } else if (
        row.timeEnd.getDate() !== data[index + 1].timeStart.getDate()
      ) {
        if (finalData.length > 0) {
          let stat = { ...row };
          let match = { ...finalData[finalData.length - 1] };
          stat.timeStart = startTime;
          stat.changeover =
            (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
              3600000) /
            60000;
          finalData.push(stat);
        } else {
          let stat = { ...row };
          stat.timeStart = startTime;
          stat.changeover = 0;
          finalData.push(stat);
        }
      }
    } else {
      if (
        finalData.length > 0 &&
        finalData[finalData.length - 1].part === row.part &&
        finalData[finalData.length - 1].shift !== row.shift &&
        row.parts > finalData[finalData.length - 1].parts
      ) {
        let stat = { ...row };
        let match = { ...finalData[finalData.length - 1] };
        stat.timeStart = startTime;
        stat.pallets -= match.pallets;
        stat.parts -= match.parts;
        stat.workActual -= match.workActual;
        stat.workActualTotal -= match.workActualTotal;
        stat.workGoal -= match.workGoal;
        stat.workGoalTotal -= match.workGoalTotal;
        stat.efficiency = (stat.workGoal / stat.workActual) * 100.0;
        stat.efficiencyTotal =
          (stat.workGoalTotal / stat.workActualTotal) * 100.0;
        stat.changeover =
          (((startTime.getTime() - match.timeEnd.getTime()) % 86400000) %
            3600000) /
          60000;
        finalData.push(stat);
      } else {
        if (
          finalData.length > 0 &&
          finalData[finalData.length - 1].shift !== 2
        ) {
          let stat = { ...row };
          stat.timeStart = startTime;
          stat.changeover =
            (((startTime.getTime() -
              finalData[finalData.length - 1].timeEnd.getTime()) %
              86400000) %
              3600000) /
            60000;
          finalData.push(stat);
        } else {
          let stat = { ...row };
          stat.timeStart = startTime;
          finalData.push(stat);
        }
      }
    }
  });
  return finalData;
};
