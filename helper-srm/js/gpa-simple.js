// Simple GPA Calculator JavaScript
let subjectCount = 6; // Starting with 6 subjects

function calculateGPA() {
    const rows = document.querySelectorAll('.input-row');
    let totalGradePoints = 0;
    let totalCredits = 0;
    let validSubjects = 0;

    rows.forEach(row => {
        const creditsSelect = row.querySelector('.credits-select');
        const gradeSelect = row.querySelector('.grade-select');
        
        const credits = parseInt(creditsSelect.value);
        const grade = parseFloat(gradeSelect.value);
        
        if (credits && !isNaN(grade)) {
            totalGradePoints += credits * grade;
            totalCredits += credits;
            validSubjects++;
        }
    });

    const gpaResult = document.getElementById('gpaResult');
    const gpaGrade = document.getElementById('gpaGrade');
    
    if (totalCredits > 0) {
        const gpa = totalGradePoints / totalCredits;
        
        // Update GPA value with animation
        gpaResult.classList.add('updated');
        gpaResult.textContent = gpa.toFixed(2);
        
        // Update grade classification
        gpaGrade.textContent = getGradeClassification(gpa);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            gpaResult.classList.remove('updated');
        }, 500);
    } else {
        gpaResult.textContent = '0.00';
        gpaGrade.textContent = 'Enter grades to calculate';
    }
}

function getGradeClassification(gpa) {
    if (gpa >= 9.5) return 'Outstanding Performance';
    if (gpa >= 8.5) return 'Excellent Performance';
    if (gpa >= 7.5) return 'Very Good Performance';
    if (gpa >= 6.5) return 'Good Performance';
    if (gpa >= 5.5) return 'Above Average Performance';
    if (gpa >= 5.0) return 'Average Performance';
    return 'Below Average Performance';
}

function addMoreRow() {
    subjectCount++;
    const calculatorInputs = document.querySelector('.calculator-inputs');
    
    // Create new row
    const newRow = document.createElement('div');
    newRow.className = 'input-row';
    newRow.setAttribute('data-row', subjectCount);
    
    newRow.innerHTML = `
        <div class="subject-number">${subjectCount}</div>
        <select class="credits-select" onchange="calculateGPA()">
            <option value="">Credits</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        </select>
        <select class="grade-select" onchange="calculateGPA()">
            <option value="">Grade</option>
            <option value="10">O (10)</option>
            <option value="9">A+ (9)</option>
            <option value="8">A (8)</option>
            <option value="7">B+ (7)</option>
            <option value="6">B (6)</option>
            <option value="5">C (5)</option>
            <option value="0">F (0)</option>
        </select>
        <button class="remove-row-btn" onclick="removeRow(${subjectCount})" title="Remove this subject">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Append to calculator inputs (before the add more section)
    calculatorInputs.appendChild(newRow);
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 100);
}

function removeRow(rowNumber) {
    const row = document.querySelector(`[data-row="${rowNumber}"]`);
    if (row) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            row.remove();
            calculateGPA(); // Recalculate after removal
        }, 300);
    }
}

function clearAll() {
    // Clear all dropdowns
    const creditsSelects = document.querySelectorAll('.credits-select');
    const gradeSelects = document.querySelectorAll('.grade-select');
    
    creditsSelects.forEach(select => {
        select.value = '';
    });
    
    gradeSelects.forEach(select => {
        select.value = '';
    });
    
    // Remove extra rows (keep only first 6)
    const allRows = document.querySelectorAll('.input-row');
    allRows.forEach((row, index) => {
        if (index >= 6) {
            row.remove();
        }
    });
    
    // Reset subject count
    subjectCount = 6;
    
    // Reset GPA display
    document.getElementById('gpaResult').textContent = '0.00';
    document.getElementById('gpaGrade').textContent = 'Enter grades to calculate';
    
    // Add clear animation
    const resultCard = document.querySelector('.result-card');
    resultCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resultCard.style.transform = 'scale(1)';
    }, 200);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth transitions to all selects
    const selects = document.querySelectorAll('.credits-select, .grade-select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add hover effects to input rows
    const inputRows = document.querySelectorAll('.input-row');
    inputRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add loading animation
    const calculator = document.querySelector('.gpa-calculator');
    calculator.style.opacity = '0';
    calculator.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        calculator.style.transition = 'all 0.6s ease';
        calculator.style.opacity = '1';
        calculator.style.transform = 'translateY(0)';
    }, 200);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to clear all
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        clearAll();
    }
    
    // Escape to clear all
    if (e.key === 'Escape') {
        clearAll();
    }
});

// Add visual feedback for grade scale items
document.addEventListener('DOMContentLoaded', () => {
    const gradeItems = document.querySelectorAll('.grade-item');
    gradeItems.forEach(item => {
        item.addEventListener('click', function() {
            // Highlight the clicked grade
            gradeItems.forEach(g => g.style.background = '');
            this.style.background = 'var(--primary-gradient)';
            this.style.color = 'white';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
});
