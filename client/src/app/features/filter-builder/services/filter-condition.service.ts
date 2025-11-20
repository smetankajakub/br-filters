import { Injectable } from '@angular/core';
import { EventSchema } from '../models/event-schema.model';


@Injectable({
  providedIn: 'root'
})
export class FilterConditionService {

  getAvailableProperties(eventType: string, eventSchema: EventSchema): string[] {
    if (!eventType) {
      return [];
    }

    const event = eventSchema.eventTypes.find(e => e.name === eventType);
    if (!event) {
      return [];
    }

    return event.properties.map(p => p.name).sort();
  }

  getPropertyType(
    eventType: string,
    propertyName: string,
    eventSchema: EventSchema
  ): 'string' | 'number' {
    if (!eventType) {
      return 'string';
    }

    const event = eventSchema.eventTypes.find(e => e.name === eventType);
    if (!event) {
      return 'string';
    }

    const property = event.properties.find(p => p.name === propertyName);
    return property?.type || 'string';
  }
}
