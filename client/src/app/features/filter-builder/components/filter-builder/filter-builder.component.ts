import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, JsonPipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FunnelStepComponent } from '../funnel-step/funnel-step.component';
import { EventSchemaService } from '../../services/event-schema.service';
import { FilterConfigForm, FunnelStepForm, AttributeCondition } from '../../models/filter-form.models';

@Component({
  selector: 'app-filter-builder',
  standalone: true,
  imports: [
    FunnelStepComponent,
    JsonPipe,
    TitleCasePipe,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBuilderComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly eventSchemaService = inject(EventSchemaService);

  readonly eventSchema = this.eventSchemaService.eventSchema;
  readonly isLoading = this.eventSchemaService.isLoading;
  readonly error = this.eventSchemaService.error;

  showFormValue = false;

  filterForm = this.#fb.group({
    funnelSteps: this.#fb.array([this.#createStepFormGroup()])
  });

  get funnelStepsArray(): FormArray {
    return this.filterForm.get('funnelSteps') as FormArray;
  }

  ngOnInit(): void {
    this.eventSchemaService.loadEventSchema();
  }

  // Form creation methods
  #createStepFormGroup(step?: FunnelStepForm): FormGroup {
    return this.#fb.group({
      id: [step?.id || crypto.randomUUID()],
      name: [step?.name || 'New Step', Validators.required],
      eventType: [step?.eventType || '', Validators.required],
      conditions: this.#fb.array(
        step?.conditions?.length
          ? step.conditions.map(c => this.#createConditionFormGroup(c))
          : [this.#createConditionFormGroup()]
      )
    });
  }

  #createConditionFormGroup(condition?: AttributeCondition): FormGroup {
    return this.#fb.group({
      id: [condition?.id || crypto.randomUUID()],
      property: [condition?.property || '', Validators.required],
      operator: [condition?.operator || '', Validators.required],
      value: [condition?.value || '', Validators.required]
    });
  }

  addFunnelStep(): void {
    const currentSteps = this.funnelStepsArray.length;
    const newStep = this.#createStepFormGroup({
      id: crypto.randomUUID(),
      name: `Step ${currentSteps + 1}`,
      eventType: '',
      conditions: []
    });
    this.funnelStepsArray.push(newStep);
  }

  removeFunnelStep(index: number): void {
    this.funnelStepsArray.removeAt(index);
  }

  copyFunnelStep(index: number): void {
    const stepFormGroup = this.funnelStepsArray.at(index) as FormGroup;
    const stepValue = stepFormGroup.value as FunnelStepForm;

    const copiedStep: FunnelStepForm = {
      id: crypto.randomUUID(),
      name: `${stepValue.name} (Copy)`,
      eventType: stepValue.eventType,
      conditions: stepValue.conditions.map(conditions => ({
        ...conditions,
        id: crypto.randomUUID()
      }))
    };

    const copiedFormGroup = this.#createStepFormGroup(copiedStep);
    this.funnelStepsArray.insert(index + 1, copiedFormGroup);
  }

  getConditionsArray(stepIndex: number): FormArray {
    const stepFormGroup = this.funnelStepsArray.at(stepIndex) as FormGroup;
    return stepFormGroup.get('conditions') as FormArray;
  }

  onAddCondition(stepIndex: number): void {
    const conditionsArray = this.getConditionsArray(stepIndex);
    conditionsArray.push(this.#createConditionFormGroup());
  }

  onRemoveCondition(stepIndex: number, conditionIndex: number): void {
    const conditionsArray = this.getConditionsArray(stepIndex);
    conditionsArray.removeAt(conditionIndex);
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.funnelStepsArray.clear();
    this.funnelStepsArray.push(this.#createStepFormGroup());
    this.showFormValue = false;
  }

  submitFilterForm(): void {
    if (this.filterForm.valid) {
      this.showFormValue = true;
    }
  }

  getStepFormGroup(index: number): FormGroup {
    return this.funnelStepsArray.at(index) as FormGroup;
  }
}
