import { AbstractControl, ValidationErrors } from '@angular/forms';

export function sudokuRangeValidator(
    control: AbstractControl
): ValidationErrors | null {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (isNaN(value) || value < 1 || value > 9) {
        return { outOfRange: true };
    }
    return null;
}
