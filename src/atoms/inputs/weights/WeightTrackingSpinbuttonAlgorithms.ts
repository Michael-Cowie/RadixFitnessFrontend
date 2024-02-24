import { FormEvent } from 'react';

export function validateInput(event: FormEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toString();
    
    const isValid = /^\d+(\.\d{1,2})?$/.test(value);
    
    if (!isValid) {
        input.setCustomValidity("Please enter a number with no more than 2 decimal places.");
    } else {
        /**
         * It's vital to set the message to an empty string if there are no errors. As long 
         * as the error message is not empty, the form will not pass validation and will not
         * be submitted.
         */
        input.setCustomValidity("");
    }
}