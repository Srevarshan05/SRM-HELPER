// GPA Calculator JavaScript
class GPACalculator {
    constructor() {
        this.subjects = [];
        this.init();
    }

    init() {
        this.loadData();
        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Load user data if available
        this.loadUserData();
    }

    loadUserData() {
        // Mock user data - in real app this would come from authentication
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = 'Student';
        }
    }

    addSubject() {
        const credits = parseInt(document.getElementById('credits').value);
        const grade = parseFloat(document.getElementById('grade').value);

        // Validation
        if (!credits) {
            this.showMessage('Please select credits', 'error');
            return;
        }

        if (isNaN(grade)) {
            this.showMessage('Please select a grade', 'error');
            return;
        }

        // Add subject
        const subject = {
            id: Date.now(),
            name: `Subject ${this.subjects.length + 1}`,
            credits: credits,
            grade: grade,
            gradePoints: credits * grade
        };

        this.subjects.push(subject);
        this.clearForm();
        this.updateDisplay();
        this.saveData();
        this.showMessage('Subject added successfully!', 'success');
    }

    removeSubject(id) {
        this.subjects = this.subjects.filter(s => s.id !== id);
        this.updateDisplay();
        this.saveData();
        this.showMessage('Subject removed successfully!', 'success');
    }

    editSubject(id) {
        const subject = this.subjects.find(s => s.id === id);
        if (!subject) return;

        // Fill form with subject data
        document.getElementById('credits').value = subject.credits;
        document.getElementById('grade').value = subject.grade;

        // Remove the subject temporarily
        this.removeSubject(id);
    }

    calculateGPA() {
        if (this.subjects.length === 0) {
            return 0;
        }

        // GPA Formula: (Sum of Credits × Grade Points) ÷ Sum of Credits
        const totalGradePoints = this.subjects.reduce((sum, subject) => sum + subject.gradePoints, 0);
        const totalCredits = this.subjects.reduce((sum, subject) => sum + subject.credits, 0);

        return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    }

    getClassification(gpa) {
        if (gpa >= 9.5) return 'Outstanding';
        if (gpa >= 8.5) return 'Excellent';
        if (gpa >= 7.5) return 'Very Good';
        if (gpa >= 6.5) return 'Good';
        if (gpa >= 5.5) return 'Above Average';
        if (gpa >= 5.0) return 'Average';
        return 'Below Average';
    }

    getGPAStatus(gpa) {
        if (gpa >= 9.0) return 'Excellent Performance';
        if (gpa >= 8.0) return 'Very Good Performance';
        if (gpa >= 7.0) return 'Good Performance';
        if (gpa >= 6.0) return 'Satisfactory Performance';
        if (gpa >= 5.0) return 'Average Performance';
        return 'Needs Improvement';
    }

    updateDisplay() {
        const gpa = this.calculateGPA();
        const totalCredits = this.subjects.reduce((sum, subject) => sum + subject.credits, 0);
        const totalSubjects = this.subjects.length;

        // Update overview cards
        document.getElementById('currentGPA').textContent = gpa.toFixed(2);
        document.getElementById('totalCredits').textContent = totalCredits;
        document.getElementById('classification').textContent = this.getClassification(gpa);
        document.getElementById('totalSubjects').textContent = totalSubjects;
        document.getElementById('gpaStatus').textContent = this.getGPAStatus(gpa);

        // Update subjects list
        this.renderSubjectsList();
    }

    renderSubjectsList() {
        const container = document.getElementById('subjectsList');
        
        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <h3>No subjects added yet</h3>
                    <p>Add your first subject to start calculating your GPA</p>
                </div>
            `;
            return;
        }

        const subjectsHTML = this.subjects.map(subject => {
            const gradeText = this.getGradeText(subject.grade);
            return `
                <div class="subject-card">
                    <div class="subject-info">
                        <div class="subject-name">${subject.name}</div>
                        <div class="subject-details">
                            <span class="subject-credits">
                                <i class="fas fa-credit-card"></i>
                                ${subject.credits} Credits
                            </span>
                            <span class="subject-grade">
                                <i class="fas fa-star"></i>
                                ${gradeText}
                            </span>
                            <span class="subject-points">
                                <i class="fas fa-calculator"></i>
                                ${subject.gradePoints} Points
                            </span>
                        </div>
                    </div>
                    <div class="subject-actions">
                        <button class="btn-icon" onclick="gpaCalculator.editSubject(${subject.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="gpaCalculator.removeSubject(${subject.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = subjectsHTML;
    }

    getGradeText(grade) {
        const gradeMap = {
            10: 'O (Outstanding)',
            9: 'A+ (Excellent)',
            8: 'A (Very Good)',
            7: 'B+ (Good)',
            6: 'B (Above Average)',
            5: 'C (Average)',
            0: 'F (Fail)'
        };
        return gradeMap[grade] || `${grade} Points`;
    }

    clearForm() {
        document.getElementById('credits').value = '';
        document.getElementById('grade').value = '';
    }

    clearAll() {
        if (this.subjects.length === 0) {
            this.showMessage('No subjects to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all subjects? This action cannot be undone.')) {
            this.subjects = [];
            this.updateDisplay();
            this.saveData();
            this.showMessage('All subjects cleared successfully!', 'success');
        }
    }

    saveData() {
        try {
            localStorage.setItem('gpa_subjects', JSON.stringify(this.subjects));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showMessage('Error saving data', 'error');
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('gpa_subjects');
            if (savedData) {
                this.subjects = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.subjects = [];
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

        // Add animation styles
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
function addSubject() {
    if (window.gpaCalculator) {
        window.gpaCalculator.addSubject();
    }
}

function clearAll() {
    if (window.gpaCalculator) {
        window.gpaCalculator.clearAll();
    }
}

function saveData() {
    if (window.gpaCalculator) {
        window.gpaCalculator.saveData();
        window.gpaCalculator.showMessage('Data saved successfully!', 'success');
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
        localStorage.removeItem('gpa_subjects');
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gpaCalculator = new GPACalculator();
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenu = document.getElementById('userMenu');
    
    if (userDropdown && userMenu && !userDropdown.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});
