interface DefinitionChartData {
  xAxisData: Array<string>;
  seriesData: Array<number>;
}

interface StateTableData {
  number: number;
  state: string;
}

interface StateChartData {
  value: number;
  name: string;
}

interface StateData {
  table: Array<StateTableData>;
  chart: Array<StateChartData>;
}

/// 航医
interface ILinesSeries {
  data: Array<number>;
  type: string;
}

// 腰带
interface IBeltRes {
  dimension: number;
  avg: string;
  max: string;
  min: string;
  id: number;
  name: string;
  pilotId: number;
}

// 床垫
interface IMattressRes {
  dimension: number;
  min: string;
  avg: string;
  max: string;
  id: number;
  name: string;
  pilotId: number;
}

export type {
  DefinitionChartData,
  StateTableData,
  StateChartData,
  StateData,
  ILinesSeries,
  IBeltRes,
  IMattressRes
};
