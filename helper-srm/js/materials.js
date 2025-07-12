// Materials Management System
class MaterialsManager {
    constructor() {
        this.currentUser = null;
        this.currentSemester = 1;
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.materialsData = {};
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.loadMaterialsData();
        this.bindEvents();
        this.renderSemesterContent();
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

    loadMaterialsData() {
        // Define the materials structure based on the Documents folder
        this.materialsData = {
            1: {
                name: "Semester 1",
                subjects: [
                    {
                        name: "Basic Electrical and Electronics",
                        code: "BEE",
                        icon: "fas fa-bolt",
                        materials: {
                            "Assignments": ["Assignment 1.pdf", "Assignment 2.pdf"],
                            "Lectures": ["Lecture 1.pdf", "Lecture 2.pdf", "Lecture 3.pdf"],
                            "Online docs": ["Reference 1.pdf", "Reference 2.pdf"],
                            "Sample Papers": ["Sample Paper 1.pdf", "Sample Paper 2.pdf"]
                        }
                    },
                    {
                        name: "Constitution of India",
                        code: "COI",
                        icon: "fas fa-landmark",
                        materials: {
                            "Documents": ["Constitution.docx", "Presentation.pptx"]
                        }
                    },
                    {
                        name: "Engineering Graphics",
                        code: "EG",
                        icon: "fas fa-drafting-compass",
                        materials: {
                            "Assignments": ["Assignment 1.pdf", "Assignment 2.pdf"],
                            "Lectures": ["Lecture 1.pdf", "Lecture 2.pdf"],
                            "Notes": ["Notes 1.pdf", "Notes 2.pdf"]
                        }
                    },
                    {
                        name: "English",
                        code: "ENG",
                        icon: "fas fa-language",
                        materials: {
                            "Lectures": ["Lecture 1.pdf", "Lecture 2.pdf"],
                            "PDFs": ["Reference 1.pdf", "Reference 2.pdf"],
                            "Sample Papers": ["Sample Paper 1.pdf"]
                        }
                    },
                    {
                        name: "Mathematics",
                        code: "MATH",
                        icon: "fas fa-calculator",
                        materials: {
                            "Assignments": ["Assignment 1.pdf", "Assignment 2.pdf"],
                            "Lectures": ["Lecture 1.pdf", "Lecture 2.pdf"],
                            "Sample Papers": ["Sample Paper 1.pdf", "Sample Paper 2.pdf"]
                        }
                    },
                    {
                        name: "Semiconductor Physics",
                        code: "SP",
                        icon: "fas fa-microchip",
                        materials: {
                            "Assignments": ["Assignment 1.pdf", "Assignment 2.pdf"],
                            "Lab": ["Lab Manual.pdf", "Lab Experiments.pdf"],
                            "Lectures": ["Lecture 1.pdf", "Lecture 2.pdf"],
                            "Question Papers": ["Question Bank.pdf"],
                            "Sample Papers": ["Sample Paper 1.pdf"]
                        }
                    }
                ]
            },
            2: {
                name: "Semester 2",
                subjects: [
                    {
                        name: "Advanced Calculus and Complex Analysis",
                        code: "ACCA",
                        icon: "fas fa-square-root-alt",
                        materials: {
                            "General Formulas": ["Formulas.pdf"],
                            "Question Banks": ["Question Bank.pdf"],
                            "Unit 1": ["Unit 1 Notes.pdf"],
                            "Unit 3": ["Unit 3 Notes.pdf"],
                            "Unit 4": ["Unit 4 Notes.pdf"],
                            "Unit 5": ["Unit 5 Notes.pdf"]
                        }
                    },
                    {
                        name: "Civil and Mechanical Workshop",
                        code: "CMW",
                        icon: "fas fa-tools",
                        materials: {
                            "Manuals": [
                                "Sheet metal work.pdf",
                                "Fitting.pdf",
                                "fitting shop.pdf",
                                "lathe manual.pdf",
                                "Lathe.pdf",
                                "welding.pdf",
                                "WORKSHOP MANUAL SRMIST TRC.pdf"
                            ]
                        }
                    },
                    {
                        name: "French",
                        code: "FR",
                        icon: "fas fa-language",
                        materials: {
                            "Question Bank": ["Question Bank.pdf"],
                            "Unit 1": ["Unit 1 Notes.pdf"]
                        }
                    },
                    {
                        name: "General Aptitude",
                        code: "GA",
                        icon: "fas fa-brain",
                        materials: {
                            "Materials": [
                                "18PDH101T - 2ND SEM.pdf",
                                "18PDH101T - A-1.pdf",
                                "18PDH101T - A.pdf"
                            ]
                        }
                    },
                    {
                        name: "Programming and Problem Solving",
                        code: "PPS",
                        icon: "fas fa-code",
                        materials: {
                            "Lectures": [
                                "Algorithms,flowhartandpseudocode.pdf",
                                "arrays.pdf",
                                "Constants, keywords,datatypes.pdf",
                                "controlstatements.pdf",
                                "controlstatements.ppt",
                                "History of C and features.pdf",
                                "InputOutputFunction.pdf",
                                "iterations1.pdf",
                                "iterations1.ppt",
                                "operators.pdf",
                                "operators.ppt",
                                "PASSING ARRAY AS AN ARGUMENT IN FUNCTION.pptx.pdf",
                                "pps 2D ARRAY BASICS slide.pdf",
                                "pps 2D ARRAY BASICS slide.pptx",
                                "STRINGS only.pdf",
                                "STRINGS only.pptx",
                                "strings1-3.pdf",
                                "strings1.pdf"
                            ],
                            "Units": [
                                "Unit 1.pdf",
                                "Unit 2.pdf",
                                "Unit 3.pdf",
                                "Unit 4.pdf",
                                "Unit 5.pdf",
                                "unit-3 biganswer 2.pdf"
                            ],
                            "CLA 3": ["CLA 3 Materials.pdf"],
                            "Notes Unit 1 to 5": ["Complete Notes.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    }
                ]
            },
            3: {
                name: "Semester 3",
                subjects: [
                    {
                        name: "Analog and Digital Electronics",
                        code: "ADE",
                        icon: "fas fa-microchip",
                        materials: {
                            "Notes": ["ade_important_topics.jpg", "Ade.pdf"],
                            "ADE Practical": ["Practical Manual.pdf"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Biology",
                        code: "BIO",
                        icon: "fas fa-dna",
                        materials: {
                            "Materials": ["Links.docx", "syllabus_bio_1.pdf"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Computer Organization and Architecture",
                        code: "COA",
                        icon: "fas fa-server",
                        materials: {
                            "Notes": ["COA IMPORTANT QUESTIONS.pdf"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Data Structures and Algorithm",
                        code: "DSA",
                        icon: "fas fa-project-diagram",
                        materials: {
                            "Notes": ["Important Topics.docx"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Management Principles for Engineers",
                        code: "MPE",
                        icon: "fas fa-chart-line",
                        materials: {
                            "Notes": ["MPE Master List.pdf", "mpe-01.jpg", "mpe-02.jpg"],
                            "Question Bank": ["Question Bank.pdf"],
                            "Unit 1": ["Unit 1 Notes.pdf"],
                            "Unit 2": ["Unit 2 Notes.pdf"],
                            "Unit 3": ["Unit 3 Notes.pdf"],
                            "Unit 4 & 5": ["Unit 4 & 5 Notes.pdf"]
                        }
                    },
                    {
                        name: "Object Oriented Design and Programming",
                        code: "OODP",
                        icon: "fas fa-object-group",
                        materials: {
                            "Materials": ["Links.docx"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Lab": ["Lab Manual.pdf"],
                            "Question Bank": ["Question Bank.pdf"],
                            "Syllabus": ["Syllabus.pdf"]
                        }
                    },
                    {
                        name: "Transforms and Boundary Value Problems",
                        code: "TBVP",
                        icon: "fas fa-wave-square",
                        materials: {
                            "Important topics": ["Important Topics.pdf"],
                            "Question banks and formulae": ["Question Bank.pdf", "Formulae.pdf"],
                            "Unit 1": ["Unit 1 Notes.pdf"],
                            "Unit 2": ["Unit 2 Notes.pdf"],
                            "Unit 3": ["Unit 3 Notes.pdf"],
                            "Unit 4": ["Unit 4 Notes.pdf"],
                            "Unit 5": ["Unit 5 Notes.pdf"]
                        }
                    }
                ]
            },
            4: {
                name: "Semester 4",
                subjects: [
                    {
                        name: "Advanced Programming Practices",
                        code: "APP",
                        icon: "fas fa-code",
                        materials: {
                            "Book": ["Reference Book.pdf"],
                            "CLA 1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question banks and Important topics": ["Question Bank.pdf", "Important Topics.pdf"]
                        }
                    },
                    {
                        name: "Computer Communications",
                        code: "CC",
                        icon: "fas fa-network-wired",
                        materials: {
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Banks": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Design and Analysis of Algorithms",
                        code: "DAA",
                        icon: "fas fa-sitemap",
                        materials: {
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Banks": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Operating System",
                        code: "OS",
                        icon: "fas fa-desktop",
                        materials: {
                            "CLA 1": ["CLA1 Materials.pdf"],
                            "CLA 2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Lab": ["Lab Manual.pdf"],
                            "Question bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Probability and Queueing Theory",
                        code: "PQT",
                        icon: "fas fa-chart-bar",
                        materials: {
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Question Bank": ["Question Bank.pdf"]
                        }
                    },
                    {
                        name: "Social Engineering",
                        code: "SE",
                        icon: "fas fa-users",
                        materials: {
                            "Materials": [
                                "ALL MCQ.pdf",
                                "imp questions se unit 1.pdf",
                                "MCQ+NOTES.pdf",
                                "Question bank _Social Engineering.pdf",
                                "SE 29 MCQ ANSWERS.pdf",
                                "SE QP 2022.pdf",
                                "Social Engineering Unit 1 - Student copy.pdf"
                            ],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"]
                        }
                    },
                    {
                        name: "Software Engineering and Product Development",
                        code: "SEPD",
                        icon: "fas fa-cogs",
                        materials: {
                            "Syllabus": ["SEPM Syllabus.pdf"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"],
                            "Lab": ["Lab Manual.pdf"],
                            "Question Banks": ["Question Bank.pdf"]
                        }
                    }
                ]
            },
            5: {
                name: "Semester 5",
                subjects: [
                    {
                        name: "Artificial Neural Networks",
                        code: "ANN",
                        icon: "fas fa-brain",
                        materials: {
                            "Syllabus": ["ANN - Syllabus.pdf"],
                            "CLA1": ["CLA1 Materials.pdf"],
                            "CLA2": ["CLA2 Materials.pdf"],
                            "CLA3": ["CLA3 Materials.pdf"]
                        }
                    },
                    {
                        name: "Computer Networks",
                        code: "CN",
                        icon: "fas fa-network-wired",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Computer Vision",
                        code: "CV",
                        icon: "fas fa-eye",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Discrete Mathematics for Engineers",
                        code: "DME",
                        icon: "fas fa-calculator",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Formal Language Automata",
                        code: "FLA",
                        icon: "fas fa-robot",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Sensors and Transducers",
                        code: "ST",
                        icon: "fas fa-satellite-dish",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    }
                ]
            },
            6: {
                name: "Semester 6",
                subjects: [
                    {
                        name: "Applied Machine Learning",
                        code: "AML",
                        icon: "fas fa-robot",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Artificial Intelligence",
                        code: "AI",
                        icon: "fas fa-brain",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Compiler Design",
                        code: "CD",
                        icon: "fas fa-code",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Database Management System",
                        code: "DBMS",
                        icon: "fas fa-database",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Digital Image Processing",
                        code: "DIP",
                        icon: "fas fa-image",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Employability Skills and Practices",
                        code: "ESP",
                        icon: "fas fa-briefcase",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Industrial Safety and Environment",
                        code: "ISE",
                        icon: "fas fa-hard-hat",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    }
                ]
            },
            7: {
                name: "Semester 7",
                subjects: [
                    {
                        name: "Genetic Algorithms and its Applications",
                        code: "GAA",
                        icon: "fas fa-dna",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    },
                    {
                        name: "Statistical Machine Learning",
                        code: "SML",
                        icon: "fas fa-chart-line",
                        materials: {
                            "Materials": ["Course Materials.pdf"]
                        }
                    }
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

        // View mode toggle
        const viewModeBtn = document.querySelector('[onclick="toggleViewMode()"]');
        if (viewModeBtn) {
            viewModeBtn.addEventListener('click', () => this.toggleViewMode());
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

        let subjects = semesterData.subjects;

        // Filter subjects based on search query
        if (this.searchQuery) {
            subjects = subjects.filter(subject => 
                subject.name.toLowerCase().includes(this.searchQuery) ||
                subject.code.toLowerCase().includes(this.searchQuery)
            );
        }

        if (subjects.length === 0) {
            container.innerHTML = this.getEmptyState('No subjects match your search');
            return;
        }

        // Set container class based on view mode
        container.className = this.viewMode === 'grid' ? 'subjects-grid' : 'subjects-list';

        // Render subjects
        container.innerHTML = subjects.map(subject => this.renderSubjectCard(subject)).join('');
    }

    renderSubjectCard(subject) {
        const materialCount = Object.values(subject.materials).reduce((total, files) => total + files.length, 0);
        const categoryCount = Object.keys(subject.materials).length;

        return `
            <div class="subject-card" onclick="openFileBrowser('${subject.name}', ${this.currentSemester})">
                <div class="subject-header">
                    <div class="subject-icon">
                        <i class="${subject.icon}"></i>
                    </div>
                    <div class="subject-info">
                        <h3>${subject.name}</h3>
                        <p>${subject.code}</p>
                    </div>
                </div>
                <div class="subject-stats">
                    <div class="stat-item">
                        <i class="fas fa-folder"></i>
                        <span>${categoryCount} Categories</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-file"></i>
                        <span>${materialCount} Files</span>
                    </div>
                </div>
                <div class="subject-actions" onclick="event.stopPropagation()">
                    <button class="action-btn" onclick="previewSubject('${subject.name}', ${this.currentSemester})">
                        <i class="fas fa-eye"></i>
                        Preview
                    </button>
                    <button class="action-btn primary" onclick="downloadSubject('${subject.name}', ${this.currentSemester})">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
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
                <p>Try adjusting your search or select a different semester</p>
            </div>
        `;
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        
        // Update button text and icon
        const viewModeIcon = document.getElementById('viewModeIcon');
        const viewModeText = document.getElementById('viewModeText');
        
        if (this.viewMode === 'grid') {
            viewModeIcon.className = 'fas fa-th-large';
            viewModeText.textContent = 'Grid View';
        } else {
            viewModeIcon.className = 'fas fa-list';
            viewModeText.textContent = 'List View';
        }

        // Re-render content
        this.renderSemesterContent();
    }

    openFileBrowser(subjectName, semester) {
        const subject = this.materialsData[semester].subjects.find(s => s.name === subjectName);
        if (!subject) return;

        const modal = document.getElementById('fileBrowserModal');
        const modalTitle = document.getElementById('modalTitle');
        const fileBrowser = document.getElementById('fileBrowser');

        modalTitle.textContent = `${subjectName} - Files`;
        
        // Render file categories
        fileBrowser.innerHTML = Object.entries(subject.materials).map(([category, files]) => 
            this.renderFileCategory(category, files)
        ).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderFileCategory(category, files) {
        return `
            <div class="file-category">
                <div class="category-header" onclick="toggleCategory(this)">
                    <h4>
                        <i class="fas fa-folder"></i>
                        ${category} (${files.length})
                    </h4>
                    <i class="fas fa-chevron-down category-toggle"></i>
                </div>
                <div class="file-list">
                    ${files.map(file => this.renderFileItem(file)).join('')}
                </div>
            </div>
        `;
    }

    renderFileItem(fileName) {
        const fileExt = fileName.split('.').pop().toLowerCase();
        let iconClass = 'default';
        
        if (['pdf'].includes(fileExt)) iconClass = 'pdf';
        else if (['doc', 'docx'].includes(fileExt)) iconClass = 'doc';
        else if (['ppt', 'pptx'].includes(fileExt)) iconClass = 'ppt';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) iconClass = 'img';

        return `
            <div class="file-item">
                <input type="checkbox" class="file-checkbox" data-file="${fileName}">
                <div class="file-icon ${iconClass}">
                    <i class="fas fa-file${iconClass === 'pdf' ? '-pdf' : iconClass === 'doc' ? '-word' : iconClass === 'ppt' ? '-powerpoint' : iconClass === 'img' ? '-image' : ''}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${fileName}</div>
                    <div class="file-meta">${fileExt.toUpperCase()} • ${this.getRandomFileSize()}</div>
                </div>
                <div class="file-actions">
                    <button class="file-action" onclick="previewFile('${fileName}')" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="file-action download" onclick="downloadFile('${fileName}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getRandomFileSize() {
        const sizes = ['1.2 MB', '2.5 MB', '850 KB', '3.1 MB', '1.8 MB', '650 KB', '4.2 MB'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    closeFileBrowser() {
        const modal = document.getElementById('fileBrowserModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    downloadSelectedFiles() {
        const selectedFiles = document.querySelectorAll('.file-checkbox:checked');
        if (selectedFiles.length === 0) {
            this.showMessage('Please select files to download', 'warning');
            return;
        }

        const fileNames = Array.from(selectedFiles).map(cb => cb.dataset.file);
        this.showMessage(`Downloading ${fileNames.length} files...`, 'success');
        
        // Simulate download
        setTimeout(() => {
            this.showMessage('Files downloaded successfully!', 'success');
            this.closeFileBrowser();
        }, 2000);
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
function openFileBrowser(subjectName, semester) {
    if (window.materialsManager) {
        window.materialsManager.openFileBrowser(subjectName, semester);
    }
}

function closeFileBrowser() {
    if (window.materialsManager) {
        window.materialsManager.closeFileBrowser();
    }
}

function toggleCategory(header) {
    header.classList.toggle('collapsed');
    const fileList = header.nextElementSibling;
    fileList.style.display = header.classList.contains('collapsed') ? 'none' : 'flex';
}

function toggleViewMode() {
    if (window.materialsManager) {
        window.materialsManager.toggleViewMode();
    }
}

function downloadSelectedFiles() {
    if (window.materialsManager) {
        window.materialsManager.downloadSelectedFiles();
    }
}

function previewFile(fileName) {
    if (window.materialsManager) {
        window.materialsManager.showMessage(`Opening preview for ${fileName}...`, 'info');
    }
}

function downloadFile(fileName) {
    if (window.materialsManager) {
        window.materialsManager.showMessage(`Downloading ${fileName}...`, 'success');
    }
}

function previewSubject(subjectName, semester) {
    if (window.materialsManager) {
        window.materialsManager.openFileBrowser(subjectName, semester);
    }
}

function downloadSubject(subjectName, semester) {
    if (window.materialsManager) {
        window.materialsManager.showMessage(`Downloading all files for ${subjectName}...`, 'success');
    }
}

function downloadSemesterMaterials() {
    if (window.materialsManager) {
        const semesterName = window.materialsManager.materialsData[window.materialsManager.currentSemester].name;
        window.materialsManager.showMessage(`Downloading all materials for ${semesterName}...`, 'success');
    }
}

function downloadAllMaterials() {
    if (window.materialsManager) {
        window.materialsManager.showMessage('Downloading all materials from all semesters...', 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const materialsManager = new MaterialsManager();
    window.materialsManager = materialsManager;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaterialsManager;
}
