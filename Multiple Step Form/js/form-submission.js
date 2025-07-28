class FormSubmission {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.successModal = document.getElementById('successModal');
        this.modalClose = document.getElementById('modalClose');
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.modalClose.addEventListener('click', () => this.closeModal());
        
        // Store form data as user fills it out
        this.form.addEventListener('input', (e) => {
            this.storeFieldData(e.target);
        });
        
        // For checkboxes and radios
        this.form.addEventListener('change', (e) => {
            this.storeFieldData(e.target);
            // Handle payment method change immediately
            if (e.target.name === 'paymentMethod') {
                this.togglePaymentValidation();
            }
        });
        
        // Initialize payment validation state
        this.togglePaymentValidation();
    }
    
    togglePaymentValidation() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const creditCardFields = ['cardNumber', 'cardName', 'expiry', 'cvv'];
        
        if (paymentMethod === 'credit') {
            // Enable validation for credit card fields
            creditCardFields.forEach(field => {
                const input = document.getElementById(field);
                if (input) input.required = true;
            });
        } else {
            // Disable validation for credit card fields
            creditCardFields.forEach(field => {
                const input = document.getElementById(field);
                if (input) input.required = false;
            });
        }
    }
    
    storeFieldData(field) {
        if (!field.name) return;
        
        if (field.type === 'checkbox') {
            if (!this.formData[field.name]) {
                this.formData[field.name] = [];
            }
            if (field.checked) {
                this.formData[field.name].push(field.value);
            } else {
                this.formData[field.name] = this.formData[field.name].filter(
                    item => item !== field.value
                );
            }
        } else if (field.type === 'radio') {
            if (field.checked) {
                this.formData[field.name] = field.value;
            }
        } else {
            this.formData[field.name] = field.value;
        }
        
        // Update review section whenever data changes
        if (document.querySelector('.form-step[data-step="5"]').classList.contains('active')) {
            this.prepareSummary();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Update payment validation state before checking
        this.togglePaymentValidation();
        
        const formValidation = new FormValidation(this.form.id);
        if (formValidation.validateForm()) {
            this.showLoading(true);
            
            // Simulate form submission (no database)
            setTimeout(() => {
                this.showLoading(false);
                this.showSuccessModal();
            }, 1000);
        } else {
            // Scroll to the first error
            const firstError = this.form.querySelector('.error-message[style="display: block;"]');
            if (firstError) {
                firstError.closest('.form-group').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    }
    
    prepareSummary() {
        const summaryContainer = document.getElementById('formSummary');
        if (!summaryContainer) return;
        
        let summaryHTML = '';
        
        // Personal Information
        summaryHTML += `
            <div class="summary-section">
                <h4>Personal Information</h4>
                <div class="summary-item">
                    <strong>Full Name</strong>
                    <span>${this.formData.firstName || ''} ${this.formData.lastName || ''}</span>
                </div>
                <div class="summary-item">
                    <strong>Email</strong>
                    <span>${this.formData.email || ''}</span>
                </div>
                ${this.formData.phone ? `
                <div class="summary-item">
                    <strong>Phone</strong>
                    <span>${this.formData.phone}</span>
                </div>
                ` : ''}
                ${this.formData.dob ? `
                <div class="summary-item">
                    <strong>Date of Birth</strong>
                    <span>${new Date(this.formData.dob).toLocaleDateString()}</span>
                </div>
                ` : ''}
                ${this.formData.gender ? `
                <div class="summary-item">
                    <strong>Gender</strong>
                    <span>${this.formatGender(this.formData.gender)}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        // Contact Information
        if (this.formData.address || this.formData.city || this.formData.country) {
            summaryHTML += `
                <div class="summary-section">
                    <h4>Contact Information</h4>
                    ${this.formData.address ? `
                    <div class="summary-item">
                        <strong>Address</strong>
                        <span>${this.formData.address}</span>
                    </div>
                    ` : ''}
                    ${this.formData.address2 ? `
                    <div class="summary-item">
                        <strong>Address Line 2</strong>
                        <span>${this.formData.address2}</span>
                    </div>
                    ` : ''}
                    ${this.formData.city || this.formData.state || this.formData.zip ? `
                    <div class="summary-item">
                        <strong>City/State/ZIP</strong>
                        <span>${this.formData.city || ''}, ${this.formData.state || ''} ${this.formData.zip || ''}</span>
                    </div>
                    ` : ''}
                    ${this.formData.country ? `
                    <div class="summary-item">
                        <strong>Country</strong>
                        <span>${this.formData.country}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Service Details
        if (this.formData.serviceType || this.formData.options || this.formData.startDate) {
            summaryHTML += `
                <div class="summary-section">
                    <h4>Service Details</h4>
                    ${this.formData.serviceType ? `
                    <div class="summary-item">
                        <strong>Service Type</strong>
                        <span>${this.formatServiceType(this.formData.serviceType)}</span>
                    </div>
                    ` : ''}
                    ${this.formData.options && this.formData.options.length > 0 ? `
                    <div class="summary-item">
                        <strong>Additional Options</strong>
                        <span>${Array.isArray(this.formData.options) ? this.formData.options.join(', ') : this.formData.options}</span>
                    </div>
                    ` : ''}
                    ${this.formData.startDate ? `
                    <div class="summary-item">
                        <strong>Start Date</strong>
                        <span>${new Date(this.formData.startDate).toLocaleDateString()}</span>
                    </div>
                    ` : ''}
                    ${this.formData.timeSlot ? `
                    <div class="summary-item">
                        <strong>Time Slot</strong>
                        <span>${this.formData.timeSlot}</span>
                    </div>
                    ` : ''}
                    ${this.formData.requirements ? `
                    <div class="summary-item">
                        <strong>Special Requirements</strong>
                        <span>${this.formData.requirements}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Payment Information
        if (this.formData.paymentMethod) {
            summaryHTML += `
                <div class="summary-section">
                    <h4>Payment Information</h4>
                    <div class="summary-item">
                        <strong>Payment Method</strong>
                        <span>${this.formatPaymentMethod(this.formData.paymentMethod)}</span>
                    </div>
            `;
            
            if (this.formData.paymentMethod === 'credit') {
                summaryHTML += `
                    ${this.formData.cardNumber ? `
                    <div class="summary-item">
                        <strong>Card Number</strong>
                        <span>•••• •••• •••• ${this.formData.cardNumber.slice(-4)}</span>
                    </div>
                    ` : ''}
                    ${this.formData.cardName ? `
                    <div class="summary-item">
                        <strong>Name on Card</strong>
                        <span>${this.formData.cardName}</span>
                    </div>
                    ` : ''}
                    ${this.formData.expiry ? `
                    <div class="summary-item">
                        <strong>Expiry Date</strong>
                        <span>${this.formData.expiry}</span>
                    </div>
                    ` : ''}
                `;
            }
            
            summaryHTML += `</div>`;
        }
        
        summaryContainer.innerHTML = summaryHTML;
        
        // Enable submit button if on review step
        if (document.querySelector('.form-step[data-step="5"]').classList.contains('active')) {
            const submitBtn = this.form.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    }
    
    formatGender(gender) {
        const genders = {
            'male': 'Male',
            'female': 'Female',
            'other': 'Other',
            'prefer-not-to-say': 'Prefer not to say'
        };
        return genders[gender] || gender;
    }
    
    formatServiceType(serviceType) {
        const types = {
            'standard': 'Standard Service',
            'premium': 'Premium Service',
            'custom': 'Custom Service'
        };
        return types[serviceType] || serviceType;
    }
    
    formatPaymentMethod(method) {
        const methods = {
            'credit': 'Credit Card',
            'paypal': 'PayPal',
            'bank': 'Bank Transfer'
        };
        return methods[method] || method;
    }
    
    showLoading(show) {
        const submitBtn = this.form.querySelector('.btn-submit');
        if (submitBtn) {
            if (show) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
            } else {
                submitBtn.innerHTML = 'Submit Application <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
            }
        }
    }
    
    showSuccessModal() {
        this.successModal.hidden = false;
        this.successModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        this.modalClose.focus();
    }
    
    closeModal() {
        this.successModal.hidden = true;
        this.successModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.resetForm();
    }
    
    resetForm() {
        this.form.reset();
        this.formData = {};
        
        // Reset steps
        const formSteps = new FormSteps(this.form.id);
        formSteps.showStep(0);
        
        // Clear all errors
        this.form.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        // Clear validation icons
        this.form.querySelectorAll('.valid-icon, .invalid-icon').forEach(el => {
            el.style.opacity = '0';
        });
        
        // Reset payment validation state
        this.togglePaymentValidation();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const formSubmission = new FormSubmission('serviceApplicationForm');
});