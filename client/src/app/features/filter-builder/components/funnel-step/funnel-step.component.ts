import { Component, input, output, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AttributeConditionComponent } from '../attribute-condition/attribute-condition.component';
import { EventSchema } from '../../models/event-schema.model';
import { FilterConditionService } from '../../services/filter-condition.service';
import { OPERATOR_GROUPS } from '../../models/operators.model';

/**
 * FunnelStepComponent with Reactive Forms
 *
 * Receives FormGroup as input signal.
 * Direct access to form controls via stepFormGroup().
 * Uses reactive forms features with signals for UI state.
 */
@Component({
  selector: 'app-funnel-step',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    AttributeConditionComponent
  ],
  templateUrl: './funnel-step.component.html',
  styleUrls: ['./funnel-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FunnelStepComponent implements OnInit {
  stepFormGroup = input.required<FormGroup>();
  stepIndex = input.required<number>();
  eventSchema = input.required<EventSchema>();

  remove = output<void>();
  copy = output<void>();
  addCondition = output<number>();
  removeCondition = output<{ stepIndex: number; conditionIndex: number }>();

  readonly #filterConditionService = inject(FilterConditionService);

  isEditingName = false;

  readonly conditionsArray = computed(() => {
    const formGroup = this.stepFormGroup();
    return formGroup ? (formGroup.get('conditions') as FormArray) : null;
  });

  filteredEvents$!: Observable<Array<{name: string, label: string, properties: any[]}>>;


  ngOnInit(): void {
    const formGroup = this.stepFormGroup();
    const eventTypeControl = formGroup.get('eventType') as FormControl;
    const schema = this.eventSchema();

    // Setup filtered events observable
    this.filteredEvents$ = eventTypeControl.valueChanges.pipe(
      startWith(eventTypeControl.value || ''),
      map(filterValue => {
        const filter = (filterValue || '').toLowerCase();
        if (!filter) {
          return schema.eventTypes;
        }
        return schema.eventTypes.filter(event =>
          event.label.toLowerCase().includes(filter) ||
          event.name.toLowerCase().includes(filter)
        );
      })
    );
  }

  getAvailableProperties(): any[] {
    const formGroup = this.stepFormGroup();
    const eventTypeControl = formGroup?.get('eventType') as FormControl;
    const eventType = eventTypeControl?.value;
    const schema = this.eventSchema();

    if (!eventType || !schema) {
      return [];
    }

    return this.#filterConditionService.getAvailableProperties(eventType, schema);
  }

  startEditingName(): void {
    this.isEditingName = true;
  }

  saveName(): void {
    const nameControl = this.stepFormGroup().get('name') as FormControl;
    if (nameControl?.value?.trim()) {
      nameControl.setValue(nameControl.value.trim());
    }
    this.isEditingName = false;
  }

  cancelEditName(): void {
    this.isEditingName = false;
    const nameControl = this.stepFormGroup().get('name') as FormControl;
    nameControl?.setValue(nameControl.value);
  }

  onAddCondition(): void {
    this.addCondition.emit(this.stepIndex());
  }

  onRemoveCondition(conditionIndex: number): void {
    this.removeCondition.emit({
      stepIndex: this.stepIndex(),
      conditionIndex
    });
  }

  getConditionFormGroup(index: number) {
    return this.conditionsArray()?.at(index) as FormGroup;
  }

  // Get operators for a condition based on property type
  getOperatorsForCondition(conditionIndex: number) {
    const conditionFormGroup = this.getConditionFormGroup(conditionIndex);
    const property = conditionFormGroup.get('property')?.value;
    const eventTypeControl = this.stepFormGroup().get('eventType') as FormControl;
    const eventType = eventTypeControl?.value;

    if (!property || !eventType) {
      return [];
    }

    const propertyType = this.#filterConditionService.getPropertyType(
      eventType,
      property,
      this.eventSchema()
    );

    return propertyType === 'number' ? OPERATOR_GROUPS.number : OPERATOR_GROUPS.string;
  }

  onRemove(): void {
    this.remove.emit();
  }

  onCopy(): void {
    this.copy.emit();
  }

  displayEventFn = (eventName: string): string => {
    if (!eventName) return '';
    const event = this.eventSchema()?.eventTypes.find(e => e.name === eventName);
    return event?.label || eventName;
  };
}
