import { FormEvent } from 'react';

export function validateInput(event: FormEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toString();
    
    const isValid = /^\d+(\.\d{1,2})?$/.test(value);
    
    if (!isValid) {
        input.setCustomValidity("Please enter a number with no more than 2 decimal places.");
    } else {
        input.setCustomValidity("");
    }
}