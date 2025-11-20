export interface EventType {
  name: string;
  label: string;
  properties: PropertyDefinition[];
}

export interface PropertyDefinition {
  name: string;
  type: 'string' | 'number';
}

export interface EventSchema {
  eventTypes: EventType[];
}

// Raw API response structure
export interface ApiResponse {
  events: ApiEvent[];
}

export interface ApiEvent {
  type: string;
  properties: ApiProperty[];
}

export interface ApiProperty {
  property: string;
  type: 'string' | 'number';
}

// Error state interface
export interface SchemaError {
  message: string;
  details?: string;
}
