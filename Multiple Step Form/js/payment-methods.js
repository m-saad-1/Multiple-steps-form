class PaymentMethods {
    constructor() {
        this.paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        this.creditCardFields = document.getElementById('creditCardFields');
        this.paypalFields = document.getElementById('paypalFields');
        this.bankFields = document.getElementById('bankFields');
        
        this.init();
    }
    
    init() {
        if (this.paymentMethodRadios.length > 0) {
            this.setupEventListeners();
            this.togglePaymentFields();
            this.fixExpiryDateField();
        }
    }
    
    setupEventListeners() {
        this.paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => this.togglePaymentFields());
        });
    }
    
    togglePaymentFields() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Hide all fields first
        this.creditCardFields.style.display = 'none';
        this.paypalFields.style.display = 'none';
        this.bankFields.style.display = 'none';
        
        // Show fields for selected method
        switch (selectedMethod) {
            case 'credit':
                this.creditCardFields.style.display = 'block';
                break;
            case 'paypal':
                this.paypalFields.style.display = 'block';
                break;
            case 'bank':
                this.bankFields.style.display = 'block';
                break;
        }
    }
    
    fixExpiryDateField() {
        const expiryField = document.getElementById('expiry');
        if (!expiryField) return;
        
        // Remove any existing inline event listeners
        expiryField.removeAttribute('onclick');
        expiryField.removeAttribute('onfocus');
        
        // Add proper event handling
        expiryField.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            // Let the native date picker handle the interaction
        });
        
        expiryField.addEventListener('focus', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            // Let the native date picker handle the interaction
        });
        
        // Fix the display of the expiry field
        expiryField.style.position = 'relative';
        expiryField.style.zIndex = 'auto';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PaymentMethods();
});