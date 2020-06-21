import { BaseLoginValidators } from './base.login.validators';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UsernameValidators extends BaseLoginValidators {
    static regexmatch(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(control.value as string).match(
                '^(FA|SP){1}[0-9]{2}[-](BAF|BAR|BBA|BBS|BCE|BCS|BDE|BEC|BEE|BEL|BET|BPH|BPY|BSB|BSE|BSI|BSM|BSO|ECE|EEE|EPE){1}[-]{1}[0-9]{3}'
            )) {
                return { regexmatch: true };
            }
            return null;
        }
    }
}