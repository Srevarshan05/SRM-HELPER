// CGPA Calculator functionality
class CGPACalculator {
    constructor() {
        this.currentUser = null;
        this.currentSemester = 1;
        this.semesterData = {};
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.loadSavedData();
        this.bindEvents();
        this.updateDisplay();
        this.renderPerformanceChart();
    }

    checkAuth() {
        this.currentUser = getCurrentUser();
        if (!this.currentUser || this.currentUser.type !== 'student') {
            window.location.href = 'index.html';
            return;
        }
    }

    loadUserData() {
        if (this.currentUser) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = this.currentUser.userName || 'Student';
            }
        }
    }

    loadSavedData() {
        const savedData = localStorage.getItem(`cgpa_${this.currentUser.id}`);
        if (savedData) {
            this.semesterData = JSON.parse(savedData);
        } else {
            // Initialize empty semester data
            for (let i = 1; i <= 8; i++) {
                this.semesterData[i] = {
                    subjects: [],
                    gpa: 0,
                    credits: 0
                };
            }
        }
    }

    bindEvents() {
        // Semester tab switching
        const semesterTabs = document.querySelectorAll('.semester-tab');
        semesterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSemester(parseInt(tab.dataset.semester));
            });
        });

        // Add subject button
        const addSubjectBtn = document.querySelector('.subject-input-form .btn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => this.addSubject());
        }

        // Enter key in subject name input
        const subjectNameInput = document.getElementById('subjectName');
        if (subjectNameInput) {
            subjectNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addSubject();
                }
            });
        }

        // Target CGPA input
        const targetCGPAInput = document.getElementById('targetCGPA');
        if (targetCGPAInput) {
            targetCGPAInput.addEventListener('input', () => {
                this.calculateGoal();
            });
        }
    }

    switchSemester(semester) {
        this.currentSemester = semester;
        
        // Update active tab
        document.querySelectorAll('.semester-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-semester="${semester}"]`).classList.add('active');

        // Update semester title
        document.getElementById('semesterTitle').textContent = `Semester ${semester}`;

        // Update semester display
        this.updateSemesterDisplay();
        this.clearInputForm();
    }

    addSubject() {
        const subjectCredits = parseInt(document.getElementById('subjectCredits').value);
        const subjectGrade = parseFloat(document.getElementById('subjectGrade').value);

        // Validation
        if (!subjectGrade && subjectGrade !== 0) {
            this.showMessage('Please select a grade', 'error');
            return;
        }

        if (!subjectCredits || subjectCredits <= 0) {
            this.showMessage('Please select valid credits', 'error');
            return;
        }

        // Generate subject name based on count
        const subjectCount = this.semesterData[this.currentSemester].subjects.length + 1;
        const subjectName = `Subject ${subjectCount}`;

        // Add subject
        const subject = {
            id: Date.now().toString(),
            name: subjectName,
            credits: subjectCredits,
            grade: subjectGrade,
            gradePoints: subjectGrade * subjectCredits
        };

        this.semesterData[this.currentSemester].subjects.push(subject);
        this.calculateSemesterGPA(this.currentSemester);
        this.updateDisplay();
        this.updateSemesterDisplay();
        this.clearInputForm();
        this.saveData();
        this.renderPerformanceChart();

        this.showMessage('Subject added successfully!', 'success');

        // Track activity
        if (window.addDashboardActivity) {
            window.addDashboardActivity('cgpa', 'Added Subject', `${subjectName} - Semester ${this.currentSemester}`);
        }
    }

    removeSubject(semesterId, subjectId) {
        this.semesterData[semesterId].subjects = this.semesterData[semesterId].subjects.filter(
            subject => subject.id !== subjectId
        );
        
        this.calculateSemesterGPA(semesterId);
        this.updateDisplay();
        this.updateSemesterDisplay();
        this.saveData();
        this.renderPerformanceChart();

        this.showMessage('Subject removed successfully!', 'success');
    }

    editSubject(semesterId, subjectId) {
        const subject = this.semesterData[semesterId].subjects.find(s => s.id === subjectId);
        if (!subject) return;

        // Fill the form with subject data
        document.getElementById('subjectCredits').value = subject.credits;
        document.getElementById('subjectGrade').value = subject.grade;

        // Remove the subject temporarily
        this.removeSubject(semesterId, subjectId);
    }

    calculateSemesterGPA(semester) {
        const subjects = this.semesterData[semester].subjects;
        
        if (subjects.length === 0) {
            this.semesterData[semester].gpa = 0;
            this.semesterData[semester].credits = 0;
            return;
        }

        let totalGradePoints = 0;
        let totalCredits = 0;

        subjects.forEach(subject => {
            totalGradePoints += subject.gradePoints;
            totalCredits += subject.credits;
        });

        this.semesterData[semester].gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
        this.semesterData[semester].credits = totalCredits;
    }

    calculateOverallCGPA() {
        let totalGradePoints = 0;
        let totalCredits = 0;
        let completedSemesters = 0;

        for (let semester = 1; semester <= 8; semester++) {
            const semesterSubjects = this.semesterData[semester].subjects;
            if (semesterSubjects.length > 0) {
                completedSemesters++;
                semesterSubjects.forEach(subject => {
                    totalGradePoints += subject.gradePoints;
                    totalCredits += subject.credits;
                });
            }
        }

        return {
            cgpa: totalCredits > 0 ? totalGradePoints / totalCredits : 0,
            totalCredits: totalCredits,
            completedSemesters: completedSemesters
        };
    }

    getGradeFromPoints(points) {
        if (points >= 9.5) return 'O';
        if (points >= 8.5) return 'A+';
        if (points >= 7.5) return 'A';
        if (points >= 6.5) return 'B+';
        if (points >= 5.5) return 'B';
        if (points >= 4.5) return 'C';
        return 'F';
    }

    getClassification(cgpa) {
        if (cgpa >= 9.5) return 'Outstanding';
        if (cgpa >= 8.5) return 'Excellent';
        if (cgpa >= 7.5) return 'Very Good';
        if (cgpa >= 6.5) return 'Good';
        if (cgpa >= 5.5) return 'Above Average';
        if (cgpa >= 4.5) return 'Average';
        return 'Below Average';
    }

    updateDisplay() {
        const overallData = this.calculateOverallCGPA();
        
        // Update overview cards
        document.getElementById('currentCGPA').textContent = overallData.cgpa.toFixed(2);
        document.getElementById('currentGrade').textContent = this.getGradeFromPoints(overallData.cgpa);
        document.getElementById('totalCredits').textContent = overallData.totalCredits;
        document.getElementById('classification').textContent = this.getClassification(overallData.cgpa);
        document.getElementById('completedSemesters').textContent = overallData.completedSemesters;
    }

    updateSemesterDisplay() {
        const semester = this.semesterData[this.currentSemester];
        
        // Update semester stats
        document.getElementById('semesterSubjects').textContent = `${semester.subjects.length} Subjects`;
        document.getElementById('semesterGPA').textContent = `GPA: ${semester.gpa.toFixed(2)}`;
        document.getElementById('semesterCredits').textContent = `${semester.credits} Credits`;

        // Update subjects list
        this.renderSubjectsList();
    }

    renderSubjectsList() {
        const subjectsList = document.getElementById('subjectsList');
        const subjects = this.semesterData[this.currentSemester].subjects;

        if (subjects.length === 0) {
            subjectsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <h3>No subjects added</h3>
                    <p>Add subjects to calculate your GPA for this semester</p>
                </div>
            `;
            return;
        }

        subjectsList.innerHTML = subjects.map(subject => `
            <div class="subject-item">
                <div class="subject-info">
                    <div class="subject-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="subject-details">
                        <h4>${subject.name}</h4>
                        <div class="subject-meta">
                            <span><i class="fas fa-credit-card"></i> ${subject.credits} Credits</span>
                            <span><i class="fas fa-star"></i> ${subject.gradePoints.toFixed(1)} Grade Points</span>
                        </div>
                    </div>
                </div>
                <div class="subject-grade">
                    <span class="grade-badge grade-${this.getGradeClass(subject.grade)}">
                        ${this.getGradeFromPoints(subject.grade)} (${subject.grade})
                    </span>
                </div>
                <div class="subject-actions">
                    <button class="action-btn" onclick="cgpaCalculator.editSubject(${this.currentSemester}, '${subject.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="cgpaCalculator.removeSubject(${this.currentSemester}, '${subject.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getGradeClass(grade) {
        if (grade >= 9.5) return 'o';
        if (grade >= 8.5) return 'a-plus';
        if (grade >= 7.5) return 'a';
        if (grade >= 6.5) return 'b-plus';
        if (grade >= 5.5) return 'b';
        if (grade >= 4.5) return 'c';
        return 'f';
    }

    renderPerformanceChart() {
        const chartContainer = document.getElementById('performanceChart');
        if (!chartContainer) return;

        chartContainer.innerHTML = '';

        for (let semester = 1; semester <= 8; semester++) {
            const semesterGPA = this.semesterData[semester].gpa;
            const hasData = this.semesterData[semester].subjects.length > 0;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = hasData ? `${(semesterGPA / 10) * 100}%` : '5%';
            bar.style.opacity = hasData ? '1' : '0.3';
            bar.setAttribute('data-semester', semester);
            bar.setAttribute('data-value', hasData ? semesterGPA.toFixed(2) : '0.00');
            
            if (!hasData) {
                bar.style.background = '#e0e0e0';
            }

            chartContainer.appendChild(bar);
        }
    }

    calculateGoal() {
        const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);
        if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
            document.getElementById('requiredGPA').textContent = '-';
            document.getElementById('creditsNeeded').textContent = '-';
            return;
        }

        const overallData = this.calculateOverallCGPA();
        const currentTotalGradePoints = overallData.cgpa * overallData.totalCredits;
        
        // Assume remaining semesters have average 20 credits each
        const remainingSemesters = 8 - overallData.completedSemesters;
        const estimatedRemainingCredits = remainingSemesters * 20;
        
        if (remainingSemesters <= 0) {
            document.getElementById('requiredGPA').textContent = 'All semesters completed';
            document.getElementById('creditsNeeded').textContent = '-';
            return;
        }

        const totalFutureCredits = overallData.totalCredits + estimatedRemainingCredits;
        const requiredTotalGradePoints = targetCGPA * totalFutureCredits;
        const requiredFutureGradePoints = requiredTotalGradePoints - currentTotalGradePoints;
        const requiredGPA = requiredFutureGradePoints / estimatedRemainingCredits;

        document.getElementById('requiredGPA').textContent = requiredGPA > 0 ? requiredGPA.toFixed(2) : 'Target already achieved!';
        document.getElementById('creditsNeeded').textContent = estimatedRemainingCredits;
    }

    clearInputForm() {
        document.getElementById('subjectCredits').value = '3';
        document.getElementById('subjectGrade').value = '';
    }

    saveData() {
        localStorage.setItem(`cgpa_${this.currentUser.id}`, JSON.stringify(this.semesterData));
        
        // Also save overall CGPA for dashboard
        const overallData = this.calculateOverallCGPA();
        const dashboardData = {
            overallCGPA: overallData.cgpa,
            totalCredits: overallData.totalCredits,
            completedSemesters: overallData.completedSemesters,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`cgpa_${this.currentUser.id}`, JSON.stringify({
            ...this.semesterData,
            ...dashboardData
        }));
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all CGPA data? This action cannot be undone.')) {
            for (let i = 1; i <= 8; i++) {
                this.semesterData[i] = {
                    subjects: [],
                    gpa: 0,
                    credits: 0
                };
            }
            
            this.updateDisplay();
            this.updateSemesterDisplay();
            this.renderPerformanceChart();
            this.saveData();
            
            this.showMessage('All data cleared successfully!', 'success');
        }
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.calculator-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `calculator-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-gradient)' : '#f44336'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    exportData() {
        const data = {
            studentInfo: {
                name: this.currentUser.userName,
                id: this.currentUser.uniqueId,
                registerNumber: this.currentUser.registerNumber
            },
            semesterData: this.semesterData,
            overallData: this.calculateOverallCGPA(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `CGPA_Data_${this.currentUser.registerNumber}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showMessage('CGPA data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.semesterData) {
                    this.semesterData = data.semesterData;
                    this.updateDisplay();
                    this.updateSemesterDisplay();
                    this.renderPerformanceChart();
                    this.saveData();
                    this.showMessage('CGPA data imported successfully!', 'success');
                } else {
                    this.showMessage('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showMessage('Error reading file!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Global functions
function addSubject() {
    if (window.cgpaCalculator) {
        window.cgpaCalculator.addSubject();
    }
}

function clearAllData() {
    if (window.cgpaCalculator) {
        window.cgpaCalculator.clearAllData();
    }
}

function saveData() {
    if (window.cgpaCalculator) {
        window.cgpaCalculator.saveData();
        window.cgpaCalculator.showMessage('Data saved successfully!', 'success');
    }
}

function calculateGoal() {
    if (window.cgpaCalculator) {
        window.cgpaCalculator.calculateGoal();
    }
}

function exportData() {
    if (window.cgpaCalculator) {
        window.cgpaCalculator.exportData();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cgpaCalculator = new CGPACalculator();
    window.cgpaCalculator = cgpaCalculator;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CGPACalculator;
}
