// prettier-ignore
export type WBEducationExpenditure = {
  OBS_VALUE: string;              // e.g. "4.09057"
  TIME_FORMAT: string;            // e.g. "P1Y"
  UNIT_MULT: number;              // e.g. 0
  COMMENT_OBS: string | null;     // e.g. null
  OBS_STATUS: string;             // e.g. "A"
  OBS_CONF: string;               // e.g. "PU"
  AGG_METHOD: string;             // e.g. "_Z"
  DECIMALS: string;               // e.g. "2"
  COMMENT_TS: string;             // e.g. "Government expenditure on education, total (% of GDP)"
  DATA_SOURCE: string;            // e.g. "WB_WDI"
  LATEST_DATA: boolean;           // e.g. false
  DATABASE_ID: string;            // e.g. "WB_WDI"
  INDICATOR: string;              // e.g. "WB_WDI_SE_XPD_TOTL_GD_ZS"
  REF_AREA: string;               // e.g. "AFE" (country or region code)
  SEX: string;                    // e.g. "_T"
  AGE: string;                    // e.g. "_T"
  URBANISATION: string;           // e.g. "_T"
  COMP_BREAKDOWN_1: string;       // e.g. "_Z"
  COMP_BREAKDOWN_2: string;       // e.g. "_Z"
  COMP_BREAKDOWN_3: string;       // e.g. "_Z"
  TIME_PERIOD: string;            // e.g. "2020"
  FREQ: string;                   // e.g. "A"
  UNIT_MEASURE: string;           // e.g. "PT_GDP"
  UNIT_TYPE: string | null;       // e.g. null
}
