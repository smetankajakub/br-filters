import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { EventSchema, EventType, ApiResponse, SchemaError } from '../models/event-schema.model';

@Injectable({
  providedIn: 'root'
})
export class EventSchemaService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  eventSchema = signal<EventSchema | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<SchemaError | null>(null);

  private readonly API_URL = 'https://br-fe-assignment.github.io/customer-events/events.json';

  loadEventSchema(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse>(this.API_URL).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        this.error.set({
          message: 'Failed to load event schema. Please try again.',
          details: error.message
        });
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        const schema = this.parseApiResponse(response);
        this.eventSchema.set(schema);
      }
    });
  }

  private parseApiResponse(response: ApiResponse): EventSchema {
    const eventTypes: EventType[] = response.events.map(event => ({
      name: event.type,
      label: event.type,
      properties: event.properties.map(prop => ({
        name: prop.property,
        type: prop.type
      }))
    }));

    return { eventTypes };
  }
}
