// Profile Management System
class ProfileManager {
    constructor() {
        this.profileData = {};
        this.originalData = {};
        this.init();
    }

    init() {
        this.loadProfileData();
        this.bindEvents();
        this.populateForm();
        this.loadUserStats();
    }

    bindEvents() {
        // Form validation on input
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Password confirmation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
        }

        // Theme change
        const themeSelect = document.getElementById('theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }
    }

    loadProfileData() {
        // Load from localStorage or set defaults
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            this.profileData = JSON.parse(savedProfile);
        } else {
            this.profileData = {
                fullName: 'Student Name',
                registerNumber: 'RA2111003010001',
                email: 'student@srmist.edu.in',
                phone: '',
                dateOfBirth: '',
                gender: '',
                currentSemester: '1',
                branch: '',
                yearOfAdmission: '',
                expectedGraduation: '',
                theme: 'light',
                emailNotifications: true,
                studyReminders: true,
                autoSave: true,
                analytics: false
            };
        }
        this.originalData = { ...this.profileData };
    }

    populateForm() {
        // Populate all form fields with saved data
        Object.keys(this.profileData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.profileData[key];
                } else {
                    element.value = this.profileData[key];
                }
            }
        });

        // Update profile display
        this.updateProfileDisplay();
    }

    updateProfileDisplay() {
        // Update profile card
        const profileName = document.getElementById('profileName');
        const profileRegNumber = document.getElementById('profileRegNumber');
        const userName = document.getElementById('userName');

        if (profileName) profileName.textContent = this.profileData.fullName || 'Student Name';
        if (profileRegNumber) profileRegNumber.textContent = this.profileData.registerNumber || 'Registration Number';
        if (userName) userName.textContent = this.profileData.fullName || 'Student';
    }

    loadUserStats() {
        // Load GPA data
        const gpaData = localStorage.getItem('gpa_subjects');
        let totalCredits = 0;
        let gpa = 0;

        if (gpaData) {
            const subjects = JSON.parse(gpaData);
            totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
            
            if (subjects.length > 0) {
                const totalGradePoints = subjects.reduce((sum, subject) => sum + subject.gradePoints, 0);
                gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
            }
        }

        // Update stats display
        const profileGPA = document.getElementById('profileGPA');
        const profileCredits = document.getElementById('profileCredits');
        const profileSemester = document.getElementById('profileSemester');

        if (profileGPA) profileGPA.textContent = gpa.toFixed(2);
        if (profileCredits) profileCredits.textContent = totalCredits;
        if (profileSemester) profileSemester.textContent = this.profileData.currentSemester || '1';
    }

    validateField(field) {
        const fieldGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing validation classes
        fieldGroup.classList.remove('success', 'error');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validation rules
        switch (field.id) {
            case 'fullName':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Full name is required';
                } else if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
                if (field.value && !phoneRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'newPassword':
                if (field.value && field.value.length < 6) {
                    isValid = false;
                    errorMessage = 'Password must be at least 6 characters';
                }
                break;

            case 'yearOfAdmission':
                const currentYear = new Date().getFullYear();
                if (field.value && (field.value < 2020 || field.value > currentYear)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid admission year';
                }
                break;
        }

        // Apply validation styling
        if (field.value && isValid) {
            fieldGroup.classList.add('success');
        } else if (!isValid) {
            fieldGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            fieldGroup.appendChild(errorDiv);
        }

        return isValid;
    }

    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const fieldGroup = confirmPassword.closest('.form-group');

        fieldGroup.classList.remove('success', 'error');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
            fieldGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Passwords do not match';
            fieldGroup.appendChild(errorDiv);
            return false;
        } else if (confirmPassword.value) {
            fieldGroup.classList.add('success');
        }

        return true;
    }

    changeTheme(theme) {
        // Apply theme immediately
        document.body.setAttribute('data-theme', theme);
        this.showMessage(`Theme changed to ${theme}`, 'success');
    }

    saveProfile() {
        // Validate all fields
        const inputs = document.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Check password match if new password is provided
        const newPassword = document.getElementById('newPassword');
        if (newPassword.value && !this.validatePasswordMatch()) {
            isValid = false;
        }

        if (!isValid) {
            this.showMessage('Please fix the errors before saving', 'error');
            return;
        }

        // Collect form data
        const formData = {};
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else if (input.value) {
                formData[input.id] = input.value;
            }
        });

        // Update profile data
        Object.assign(this.profileData, formData);

        // Save to localStorage
        localStorage.setItem('user_profile', JSON.stringify(this.profileData));

        // Update displays
        this.updateProfileDisplay();
        this.loadUserStats();

        // Update original data
        this.originalData = { ...this.profileData };

        this.showMessage('Profile saved successfully!', 'success');
    }

    resetProfile() {
        if (confirm('Are you sure you want to reset all changes? This will restore your profile to the last saved state.')) {
            this.profileData = { ...this.originalData };
            this.populateForm();
            this.showMessage('Profile reset to last saved state', 'info');
        }
    }

    uploadAvatar() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    this.showMessage('Image size should be less than 5MB', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarImage = document.getElementById('avatarImage');
                    avatarImage.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
                    
                    // Save to profile data
                    this.profileData.avatar = e.target.result;
                    this.showMessage('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all your data? This will remove all saved GPA, attendance, and preference data. This action cannot be undone.')) {
            const confirmText = prompt('Type "DELETE" to confirm this action:');
            if (confirmText === 'DELETE') {
                // Clear all localStorage data
                localStorage.removeItem('gpa_subjects');
                localStorage.removeItem('attendance_data');
                localStorage.removeItem('study_timer_data');
                localStorage.removeItem('user_preferences');
                
                this.showMessage('All data cleared successfully', 'success');
                this.loadUserStats();
            } else {
                this.showMessage('Data clearing cancelled', 'info');
            }
        }
    }

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.')) {
            const confirmText = prompt('Type "DELETE ACCOUNT" to confirm this action:');
            if (confirmText === 'DELETE ACCOUNT') {
                // Clear all data
                localStorage.clear();
                this.showMessage('Account deleted successfully. Redirecting to login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                this.showMessage('Account deletion cancelled', 'info');
            }
        }
    }

    showMessage(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Global functions
function saveProfile() {
    if (window.profileManager) {
        window.profileManager.saveProfile();
    }
}

function resetProfile() {
    if (window.profileManager) {
        window.profileManager.resetProfile();
    }
}

function uploadAvatar() {
    if (window.profileManager) {
        window.profileManager.uploadAvatar();
    }
}

function clearAllData() {
    if (window.profileManager) {
        window.profileManager.clearAllData();
    }
}

function deleteAccount() {
    if (window.profileManager) {
        window.profileManager.deleteAccount();
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenu = document.getElementById('userMenu');
    
    if (userDropdown && userMenu && !userDropdown.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
