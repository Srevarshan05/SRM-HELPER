class AttendanceCalculator {
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
        // Any additional event bindings can go here
    }

    addSubject() {
        const subjectName = document.getElementById('subjectName').value.trim();
        const totalHours = parseInt(document.getElementById('totalHours').value);
        const hoursAttended = parseInt(document.getElementById('hoursAttended').value);
        const requiredPercentage = parseFloat(document.getElementById('requiredPercentage').value);

        // Validation
        if (!subjectName) {
            this.showMessage('Please enter a subject name', 'error');
            return;
        }
        if (isNaN(totalHours) || totalHours <= 0) {
            this.showMessage('Please enter valid total hours', 'error');
            return;
        }
        if (isNaN(hoursAttended) || hoursAttended < 0 || hoursAttended > totalHours) {
            this.showMessage('Please enter valid hours attended', 'error');
            return;
        }
        if (isNaN(requiredPercentage) || requiredPercentage < 0 || requiredPercentage > 100) {
            this.showMessage('Please enter a valid required percentage (0-100)', 'error');
            return;
        }

        // Add subject
        const subject = {
            id: Date.now(),
            name: subjectName,
            totalHours: totalHours,
            hoursAttended: hoursAttended,
            requiredPercentage: requiredPercentage
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
        document.getElementById('subjectName').value = subject.name;
        document.getElementById('totalHours').value = subject.totalHours;
        document.getElementById('hoursAttended').value = subject.hoursAttended;
        document.getElementById('requiredPercentage').value = subject.requiredPercentage;

        // Remove the subject temporarily
        this.removeSubject(id);
    }

    calculateAttendance(subject) {
        const percentage = (subject.hoursAttended / subject.totalHours) * 100;
        const minHoursRequired = (subject.requiredPercentage / 100) * subject.totalHours;
        const remainingHours = minHoursRequired - subject.hoursAttended;

        return {
            percentage: percentage.toFixed(2),
            status: percentage >= subject.requiredPercentage ? 'Safe' : 'At Risk',
            remainingHours: remainingHours > 0 ? Math.ceil(remainingHours) : 0,
            extraHoursNeeded: remainingHours < 0 ? Math.ceil(-remainingHours) : 0
        };
    }

    updateDisplay() {
        this.renderSubjectsList();
    }

    renderSubjectsList() {
        const container = document.getElementById('subjectsList');

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h3>No subjects added yet</h3>
                    <p>Add your first subject to track your attendance</p>
                </div>
            `;
            return;
        }

        const subjectsHTML = this.subjects.map(subject => {
            const attendance = this.calculateAttendance(subject);
            return `
                <div class="subject-card">
                    <div class="subject-info">
                        <div class="subject-name">${subject.name}</div>
                        <div class="subject-details">
                            <span class="subject-credits">
                                <i class="fas fa-clock"></i>
                                ${attendance.percentage}% Attendance
                            </span>
                            <span class="subject-grade">
                                <i class="fas fa-${attendance.status === 'Safe' ? 'check-circle' : 'exclamation-circle'}"></i>
                                ${attendance.status}
                            </span>
                            <span class="subject-points">
                                <i class="fas fa-calendar-alt"></i>
                                ${attendance.remainingHours > 0 ? 
                                    `${attendance.remainingHours} hours can be missed` : 
                                    `Need ${attendance.extraHoursNeeded} more hours`}
                            </span>
                        </div>
                    </div>
                    <div class="subject-actions">
                        <button class="btn-icon" onclick="attendanceCalculator.editSubject(${subject.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="attendanceCalculator.removeSubject(${subject.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = subjectsHTML;
    }

    clearForm() {
        document.getElementById('subjectName').value = '';
        document.getElementById('totalHours').value = '';
        document.getElementById('hoursAttended').value = '';
        document.getElementById('requiredPercentage').value = '75';
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
            localStorage.setItem('attendance_subjects', JSON.stringify(this.subjects));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showMessage('Error saving data', 'error');
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('attendance_subjects');
            if (savedData) {
                this.subjects = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.subjects = [];
        }
    }

    showMessage(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

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
    if (window.attendanceCalculator) {
        window.attendanceCalculator.addSubject();
    }
}

function clearAll() {
    if (window.attendanceCalculator) {
        window.attendanceCalculator.clearAll();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.attendanceCalculator = new AttendanceCalculator();
});