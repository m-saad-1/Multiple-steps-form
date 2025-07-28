class AddressToggle {
    constructor() {
        this.sameAddressCheckbox = document.getElementById('billingAddressSame');
        this.billingAddressFields = document.getElementById('billingAddressFields');
        
        if (this.sameAddressCheckbox && this.billingAddressFields) {
            this.init();
        }
    }
    
    init() {
        this.sameAddressCheckbox.addEventListener('change', () => {
            this.billingAddressFields.style.display = 
                this.sameAddressCheckbox.checked ? 'none' : 'block';
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AddressToggle();
});