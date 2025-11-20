export interface FilterCondition {
  eventTypes: string[];
  property: string;
  operator: string;
  value: string;
}

export interface FunnelStep {
  name: string;
  conditions: FilterCondition[];
}

export interface FilterConfig {
  funnelSteps: FunnelStep[];
}
