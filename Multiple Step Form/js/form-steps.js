class FormSteps {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.steps = Array.from(this.form.querySelectorAll('.form-step'));
        this.progressSteps = Array.from(document.querySelectorAll('.progress-steps .step'));
        this.nextBtn = this.form.querySelector('.btn-next');
        this.backBtn = this.form.querySelector('.btn-back');
        this.submitBtn = this.form.querySelector('.btn-submit');
        this.stepIndicator = this.form.querySelector('.step-indicator');
        this.currentStep = 0;
        this.totalSteps = this.steps.length;
        
        this.init();
    }
    
    init() {
        this.updateProgress();
        this.updateButtons();
        this.updateStepIndicator();
        this.setupEventListeners();
        this.setMinDates();
    }
    
    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.backBtn.addEventListener('click', () => this.prevStep());
        this.form.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }
    
    
    showStep(stepIndex) {
        this.steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
            step.disabled = index !== stepIndex;
        });
        
        this.currentStep = stepIndex;
        this.updateProgress();
        this.updateButtons();
        this.updateStepIndicator();
        
        // Update review section when reaching the review step
        if (stepIndex === this.totalSteps - 1) {
            const formSubmission = new FormSubmission(this.form.id);
            formSubmission.prepareSummary();
        }
        
        // Focus first input in step for accessibility
        const firstInput = this.steps[stepIndex].querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }
    
    nextStep() {
        if (this.validateStep(this.currentStep)) {
            if (this.currentStep < this.totalSteps - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.form.dispatchEvent(new Event('submit'));
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    validateStep(stepIndex) {
        const currentStepFields = this.steps[stepIndex].querySelectorAll('[required]');
        let isValid = true;
        
        currentStepFields.forEach(field => {
            if (!field.checkValidity()) {
                this.showError(field, field.validationMessage || 'This field is required');
                isValid = false;
            }
        });
        
        // Special validation for terms agreement on last step
        if (stepIndex === this.totalSteps - 1) {
            const termsAgreement = this.form.querySelector('#termsAgreement');
            if (termsAgreement && !termsAgreement.checked) {
                this.showError(termsAgreement, 'You must accept the terms and conditions');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
            
            // Scroll to the first error in the step
            if (!this.form.querySelector('.error-message[style="display: block;"]')) {
                formGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    updateProgress() {
        this.progressSteps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
            
            step.setAttribute('aria-current', index === this.currentStep ? 'step' : 'false');
        });
        
        const progressPercent = (this.currentStep / (this.totalSteps - 1)) * 100;
        document.querySelector('.progress-indicator').setAttribute('aria-valuenow', this.currentStep + 1);
    }
    
    updateButtons() {
        this.backBtn.disabled = this.currentStep === 0;
        this.nextBtn.style.display = this.currentStep === this.totalSteps - 1 ? 'none' : 'flex';
        this.submitBtn.style.display = this.currentStep === this.totalSteps - 1 ? 'flex' : 'none';
    }
    
    updateStepIndicator() {
        if (this.stepIndicator) {
            this.stepIndicator.querySelector('#currentStep').textContent = this.currentStep + 1;
            this.stepIndicator.querySelector('#totalSteps').textContent = this.totalSteps;
        }
    }
    
    handleKeyNavigation(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            this.nextStep();
        }
    }
    
    setMinDates() {
        // Set max date for date of birth (must be at least 18 years old)
        const dobField = this.form.querySelector('#dob');
        if (dobField) {
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            dobField.max = minDate.toISOString().split('T')[0];
        }
        
        // Set min date for start date (today)
        const startDateField = this.form.querySelector('#startDate');
        if (startDateField) {
            startDateField.min = new Date().toISOString().split('T')[0];
        }
        
        // Set min month for credit card expiry (current month)
        const expiryField = this.form.querySelector('#expiry');
        if (expiryField) {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            expiryField.min = `${year}-${month}`;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const formSteps = new FormSteps('serviceApplicationForm');
});