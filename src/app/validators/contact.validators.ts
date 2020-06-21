import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ContactValidators {
    static contactcheck(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(control.value as string).match('^(03){1}[0-9]{9}')) {
                return { contactcheck: true };
            }
            return null;
        }
    }
}