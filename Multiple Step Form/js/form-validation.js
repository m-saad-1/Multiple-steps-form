class FormValidation {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.setupLiveValidation();
        this.setupCustomValidation();
    }
    
    setupLiveValidation() {
        // Real-time validation on input
        this.form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('required') || e.target.hasAttribute('pattern')) {
                this.validateField(e.target);
            }
        });
        
        // Validate on blur
        this.form.addEventListener('focusout', (e) => {
            if (e.target.hasAttribute('required') || e.target.hasAttribute('pattern')) {
                this.validateField(e.target);
            }
        });
    }
    
    setupCustomValidation() {
        // Custom email validation
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField) {
            emailField.addEventListener('input', () => {
                if (!emailField.validity.valid) {
                    this.showError(emailField, 'Please enter a valid email address');
                }
            });
        }
        
        // Custom phone validation
        const phoneField = this.form.querySelector('input[type="tel"]');
        if (phoneField) {
            phoneField.addEventListener('input', () => {
                if (phoneField.value && !phoneField.validity.valid) {
                    this.showError(phoneField, 'Please enter a valid phone number');
                }
            });
        }
        
        // Date validation
        const dateFields = this.form.querySelectorAll('input[type="date"]');
        dateFields.forEach(dateField => {
            dateField.addEventListener('change', () => {
                if (dateField.value) {
                    const selectedDate = new Date(dateField.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (dateField.id === 'dob' && selectedDate > today) {
                        this.showError(dateField, 'You must be at least 18 years old');
                        dateField.setCustomValidity('Invalid date');
                    } else if (dateField.id === 'startDate' && selectedDate < today) {
                        this.showError(dateField, 'Please select a future date');
                        dateField.setCustomValidity('Invalid date');
                    } else {
                        this.clearError(dateField);
                        dateField.setCustomValidity('');
                    }
                }
            });
        });
        
        // Credit card validation
        const cardNumberField = this.form.querySelector('#cardNumber');
        if (cardNumberField) {
            cardNumberField.addEventListener('input', (e) => {
                // Format card number with spaces
                let value = e.target.value.replace(/\s+/g, '');
                if (value.length > 0) {
                    value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
                }
                e.target.value = value;
                
                // Validate length (16-19 digits)
                const digits = value.replace(/\s+/g, '');
                if (digits.length < 16 || digits.length > 19) {
                    this.showError(cardNumberField, 'Card number must be 16-19 digits');
                } else {
                    this.clearError(cardNumberField);
                }
            });
        }
        
        // CVV validation
        const cvvField = this.form.querySelector('#cvv');
        if (cvvField) {
            cvvField.addEventListener('input', (e) => {
                if (e.target.value.length < 3 || e.target.value.length > 4) {
                    this.showError(cvvField, 'CVV must be 3-4 digits');
                } else {
                    this.clearError(cvvField);
                }
            });
        }
    }
    
    validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        
        if (field.validity.valid) {
            this.clearError(field);
        } else {
            let message = '';
            
            if (field.validity.valueMissing) {
                message = 'This field is required';
            } else if (field.validity.typeMismatch) {
                message = field.type === 'email' 
                    ? 'Please enter a valid email address' 
                    : 'Please enter a valid value';
            } else if (field.validity.patternMismatch) {
                message = 'Please match the requested format';
            } else if (field.validity.tooShort) {
                message = `Minimum length is ${field.minLength} characters`;
            } else if (field.validity.customError) {
                message = field.validationMessage;
            } else {
                message = 'Please correct this field';
            }
            
            this.showError(field, message);
        }
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
        }
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            field.removeAttribute('aria-invalid');
        }
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.validity.valid) {
                this.validateField(field);
                isValid = false;
            }
        });
        
        // Special validation for terms agreement
        const termsAgreement = this.form.querySelector('#termsAgreement');
        if (termsAgreement && !termsAgreement.checked) {
            this.showError(termsAgreement, 'You must accept the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const formValidation = new FormValidation('serviceApplicationForm');
});