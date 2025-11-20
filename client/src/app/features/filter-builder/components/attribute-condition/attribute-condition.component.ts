import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Operator } from '../../models/operators.model';

@Component({
  selector: 'app-attribute-condition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './attribute-condition.component.html',
  styleUrls: ['./attribute-condition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeConditionComponent {
  conditionFormGroup = input.required<FormGroup>();
  availableProperties = input.required<string[]>();
  availableOperators = input.required<Operator[]>();

  remove = output<void>();

  onRemove(): void {
    this.remove.emit();
  }
}
