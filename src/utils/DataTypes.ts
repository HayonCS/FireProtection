export interface DashboardGraphData {
  partCycle: number;
  time: Date;
  timeString: string;
  workActual: number;
  workTheory: number;
  efficiency: number;
  Efficiency: string;
}

export interface AssetTestData {
  id: number;
  shift: number;
  partNumber: string;
  timeStart: Date;
  timeEnd: Date;
  passes: number;
  fails: number;
  partCycle: number;
  workActual: number;
  workTheory: number;
  efficiency: number;
}

export interface WaveStats {
  id: number;
  date: Date;
  shift: number;
  part: string;
  board: string;
  recipe: string;
  pallets: number;
  parts: number;
  palletsTotal: number;
  partsTotal: number;
  partTypes: number;
  cycleGoal: number;
  cycleLast: number;
  workActual: number;
  workGoal: number;
  workActualTotal: number;
  workGoalTotal: number;
  efficiency: number;
  efficiencyTotal: number;
  changeover: number;
  downtime: number;
}

export interface WaveDataRows {
  id: number;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  shift: number;
  part: string;
  board: string;
  recipe: string;
  pallets: number;
  parts: number;
  palletsTotal: number;
  partsTotal: number;
  partTypes: number;
  cycleGoal: number;
  cycleLast: number;
  workActual: number;
  workGoal: number;
  workActualTotal: number;
  workGoalTotal: number;
  efficiency: number;
  efficiencyTotal: number;
  changeover: number;
  downtime: number;
}

export interface WaveData {
  id: number;
  date: Date;
  time: Date;
  shift: number;
  part: string;
  board: string;
  recipe: string;
  pallets: number;
  parts: number;
  palletsTotal: number;
  partsTotal: number;
  partTypes: number;
  cycleGoal: number;
  cycleLast: number;
  cycleEfficiency: number;
  workActual: number;
  workGoal: number;
  workActualTotal: number;
  workGoalTotal: number;
  efficiency: number;
  efficiencyTotal: number;
  changeover: number;
  downtime: number;
  aheadPart: number;
  aheadTotal: number;
}

export interface ManualBuildDataAll {
  id: number;
  date: Date;
  time: Date;
  shift: number;
  station: number;
  part: string;
  count: number;
  cycle: number;
}

export interface ManualBuildDataStation {
  id: number;
  date: Date;
  time: Date;
  shift: number;
  part: string;
  count: number;
  cycle: number;
}
