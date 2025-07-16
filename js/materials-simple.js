// Simplified Materials Management System
class SimpleMaterialsManager {
    constructor() {
        this.currentSemester = 1;
        this.materialsData = {};
        this.init();
    }

    init() {
        this.loadMaterialsData();
        this.bindEvents();
        this.renderSemesterContent();
    }

    loadMaterialsData() {
        // Define the materials structure with download URLs for each semester
        this.materialsData = {
            1: {
                name: "Semester 1",
                downloadUrl: "../Documents/Semester 1/",
                subjects: [
                    "Basic Electrical and Electronics",
                    "Constitution of India", 
                    "Engineering Graphics",
                    "English",
                    "Mathematics",
                    "Semiconductor Physics"
                ]
            },
            2: {
                name: "Semester 2", 
                downloadUrl: "../Documents/Semester 2/",
                subjects: [
                    "Advanced Calculus and Complex Analysis",
                    "Civil and Mechanical Workshop",
                    "French",
                    "General Aptitude",
                    "Programming and Problem Solving"
                ]
            },
            3: {
                name: "Semester 3",
                downloadUrl: "../Documents/Semester 3 notes/",
                subjects: [
                    "Analog and Digital Electronics",
                    "Biology",
                    "Computer Organization and Architecture", 
                    "Data Structures and Algorithm",
                    "Management Principles for Engineers",
                    "Object Oriented Design and Programming",
                    "Transforms and Boundary Value Problems"
                ]
            },
            4: {
                name: "Semester 4",
                downloadUrl: "../Documents/Semester 4 notes/",
                subjects: [
                    "Advanced Programming Practices",
                    "Computer Communications",
                    "Design and Analysis of Algorithms",
                    "Operating System",
                    "Probability and Queueing Theory",
                    "Social Engineering",
                    "Software Engineering and Product Development"
                ]
            },
            5: {
                name: "Semester 5",
                downloadUrl: "../Documents/Semester 5/",
                subjects: [
                    "Artificial Neural Networks",
                    "Computer Networks",
                    "Computer Vision",
                    "Discrete Mathematics for Engineers",
                    "Formal Language Automata",
                    "Sensors and Transducers"
                ]
            },
            6: {
                name: "Semester 6",
                downloadUrl: "../Documents/Semester 6/",
                subjects: [
                    "Applied Machine Learning",
                    "Artificial Intelligence",
                    "Compiler Design",
                    "Database Management System",
                    "Digital Image Processing",
                    "Employability Skills and Practices",
                    "Industrial Safety and Environment"
                ]
            },
            7: {
                name: "Semester 7",
                downloadUrl: "../Documents/Semester 7/",
                subjects: [
                    "Genetic Algorithms and its Applications",
                    "Statistical Machine Learning"
                ]
            }
        };
    }

    bindEvents() {
        // Semester tab switching
        const semesterTabs = document.querySelectorAll('.semester-tab');
        semesterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSemester(parseInt(tab.dataset.semester));
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderSemesterContent();
            });
        }
    }

    switchSemester(semester) {
        this.currentSemester = semester;
        
        // Update active tab
        document.querySelectorAll('.semester-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-semester="${semester}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update semester title
        const semesterTitle = document.getElementById('semesterTitle');
        if (semesterTitle) {
            semesterTitle.textContent = `${this.materialsData[semester].name} Materials`;
        }

        // Render semester content
        this.renderSemesterContent();
    }

    renderSemesterContent() {
        const container = document.getElementById('subjectsContainer');
        if (!container) return;

        const semesterData = this.materialsData[this.currentSemester];
        if (!semesterData) {
            container.innerHTML = this.getEmptyState('No materials found for this semester');
            return;
        }

        // Render download section
        container.innerHTML = `
            <div class="download-section">
                <div class="download-header">
                    <div class="download-info">
                        <h3><i class="fas fa-download"></i> Download ${semesterData.name} Materials</h3>
                        <p>Access all study materials for ${semesterData.name} including notes, assignments, and question papers</p>
                    </div>
                    <div class="download-stats">
                        <div class="stat-item">
                            <i class="fas fa-book"></i>
                            <span>${semesterData.subjects.length} Subjects</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-folder"></i>
                            <span>Complete Materials</span>
                        </div>
                    </div>
                </div>

                <div class="download-actions">
                    <button class="btn btn-primary download-btn" onclick="downloadSemesterMaterials('${semesterData.downloadUrl}')">
                        <i class="fas fa-download"></i>
                        Download All Materials
                    </button>
                    <button class="btn btn-outline" onclick="openMaterialsFolder('${semesterData.downloadUrl}')">
                        <i class="fas fa-folder-open"></i>
                        Open Folder
                    </button>
                </div>

                <div class="subjects-preview">
                    <h4>Subjects Included:</h4>
                    <div class="subjects-grid">
                        ${semesterData.subjects.map(subject => `
                            <div class="subject-preview-card">
                                <div class="subject-icon">
                                    <i class="fas fa-book"></i>
                                </div>
                                <div class="subject-name">${subject}</div>
                                <button class="subject-download-btn" onclick="downloadSubjectMaterials('${semesterData.downloadUrl}${subject}/')">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="download-instructions">
                    <h4><i class="fas fa-info-circle"></i> Download Instructions</h4>
                    <ul>
                        <li>Click "Download All Materials" to get the complete semester folder</li>
                        <li>Click on individual subject cards to download specific subject materials</li>
                        <li>Use "Open Folder" to browse materials in your file explorer</li>
                        <li>All materials include lectures, assignments, question papers, and reference materials</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getEmptyState(message) {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h3>${message}</h3>
                <p>Try selecting a different semester</p>
            </div>
        `;
    }

    showMessage(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
function downloadSemesterMaterials(url) {
    if (window.simpleMaterialsManager) {
        window.simpleMaterialsManager.showMessage(`Downloading materials from: ${url}`, 'success');
        // In a real application, this would trigger an actual download
        window.open(url, '_blank');
    }
}

function downloadSubjectMaterials(url) {
    if (window.simpleMaterialsManager) {
        window.simpleMaterialsManager.showMessage(`Downloading subject materials from: ${url}`, 'success');
        // In a real application, this would trigger an actual download
        window.open(url, '_blank');
    }
}

function openMaterialsFolder(url) {
    if (window.simpleMaterialsManager) {
        window.simpleMaterialsManager.showMessage(`Opening folder: ${url}`, 'info');
        // In a real application, this would open the folder in file explorer
        window.open(url, '_blank');
    }
}

function downloadAllMaterials() {
    if (window.simpleMaterialsManager) {
        window.simpleMaterialsManager.showMessage('Downloading all materials from all semesters...', 'success');
        // In a real application, this would trigger a bulk download
        window.open('../Documents/', '_blank');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simpleMaterialsManager = new SimpleMaterialsManager();
});
