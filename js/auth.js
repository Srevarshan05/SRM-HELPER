// Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('helperSrmUsers')) || [];
        this.admins = JSON.parse(localStorage.getItem('helperSrmAdmins')) || [
            {
                id: 'admin001',
                username: 'admin',
                password: 'admin123',
                name: 'System Administrator',
                email: 'admin@helpersrm.com'
            }
        ];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupFormElement').addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('adminLoginFormElement').addEventListener('submit', (e) => this.handleAdminLogin(e));
    }

    checkAuthStatus() {
        if (this.currentUser) {
            if (this.currentUser.type === 'admin') {
                window.location.href = 'admin-panel.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }
    }

    generateUniqueId() {
        let id;
        do {
            id = Math.floor(10000 + Math.random() * 90000).toString();
        } while (this.users.some(user => user.uniqueId === id));
        return id;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    showMessage(message, type = 'error') {
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i> ${message}`;
        
        const activeForm = document.querySelector('.auth-form.active');
        activeForm.insertBefore(messageDiv, activeForm.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    async handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        // Validation
        if (!userData.registerNumber || !userData.userName || !userData.email || !userData.password) {
            this.showMessage('Please fill in all fields');
            return;
        }

        if (!this.validateEmail(userData.email)) {
            this.showMessage('Please enter a valid email address');
            return;
        }

        if (!this.validatePassword(userData.password)) {
            this.showMessage('Password must be at least 6 characters long');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showMessage('Passwords do not match');
            return;
        }

        // Check if user already exists
        if (this.users.some(user => user.registerNumber === userData.registerNumber)) {
            this.showMessage('Register number already exists');
            return;
        }

        if (this.users.some(user => user.email === userData.email)) {
            this.showMessage('Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            uniqueId: this.generateUniqueId(),
            registerNumber: userData.registerNumber,
            userName: userData.userName,
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };

        this.users.push(newUser);
        localStorage.setItem('helperSrmUsers', JSON.stringify(this.users));

        this.showMessage(`Account created successfully! Your unique ID is: ${newUser.uniqueId}`, 'success');
        
        setTimeout(() => {
            showLogin();
        }, 2000);
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData);

        if (!loginData.loginId || !loginData.password) {
            this.showMessage('Please enter both ID and password');
            return;
        }

        // Find user by register number or unique ID
        const user = this.users.find(u => 
            u.registerNumber === loginData.loginId || 
            u.uniqueId === loginData.loginId
        );

        if (!user) {
            this.showMessage('User not found');
            return;
        }

        if (user.password !== loginData.password) {
            this.showMessage('Invalid password');
            return;
        }

        if (!user.isActive) {
            this.showMessage('Account is deactivated. Contact administrator.');
            return;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('helperSrmUsers', JSON.stringify(this.users));

        // Set current user
        this.currentUser = { ...user, type: 'student' };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const adminData = Object.fromEntries(formData);

        if (!adminData.adminId || !adminData.password) {
            this.showMessage('Please enter both admin ID and password');
            return;
        }

        const admin = this.admins.find(a => a.id === adminData.adminId || a.username === adminData.adminId);

        if (!admin || admin.password !== adminData.password) {
            this.showMessage('Invalid admin credentials');
            return;
        }

        // Set current admin
        this.currentUser = { ...admin, type: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.showMessage('Admin login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin-panel.html';
        }, 1500);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.users;
    }

    updateUser(userId, userData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            localStorage.setItem('helperSrmUsers', JSON.stringify(this.users));
            return true;
        }
        return false;
    }

    deleteUser(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        localStorage.setItem('helperSrmUsers', JSON.stringify(this.users));
    }
}

// Form switching functions
function showLogin() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
}

function showSignup() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('signupForm').classList.add('active');
}

function showAdminLogin() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('adminLoginForm').classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Add some demo users for testing
if (authSystem.getAllUsers().length === 0) {
    const demoUsers = [
        {
            id: '1',
            uniqueId: '12345',
            registerNumber: 'RA2011003010001',
            userName: 'John Doe',
            email: 'john.doe@srmist.edu.in',
            password: 'password123',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        },
        {
            id: '2',
            uniqueId: '67890',
            registerNumber: 'RA2011003010002',
            userName: 'Jane Smith',
            email: 'jane.smith@srmist.edu.in',
            password: 'password123',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        }
    ];
    
    localStorage.setItem('helperSrmUsers', JSON.stringify(demoUsers));
    authSystem.users = demoUsers;
}

// Global auth functions for other pages
window.authSystem = authSystem;
window.logout = () => authSystem.logout();
window.getCurrentUser = () => authSystem.getCurrentUser();
