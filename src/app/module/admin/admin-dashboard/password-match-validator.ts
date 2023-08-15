import { AbstractControl, ValidatorFn } from "@angular/forms";


export function passwordMatchValidator(): ValidatorFn {
  
  return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
  
      if (!password || !confirmPassword) {
        return null;
      }
  
      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
}