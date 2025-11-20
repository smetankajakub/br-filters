export interface AttributeCondition {
  id: string;
  property: string;
  operator: string;
  value: string;
}

export interface FunnelStepForm {
  id: string;
  name: string;
  eventType: string;
  conditions: AttributeCondition[];
}

export interface FilterConfigForm {
  funnelSteps: FunnelStepForm[];
}
