// Semesters page functionality
class SemestersManager {
    constructor() {
        this.currentUser = null;
        this.currentSemester = 'all';
        this.searchQuery = '';
        this.activeFilters = {
            materialTypes: ['notes', 'assignments', 'question-papers', 'lab'],
            semesters: ['all']
        };
        this.materialsData = {};
        this.selectedMaterial = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.initializeMaterialsData();
        this.bindEvents();
        this.loadMaterials();
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

    initializeMaterialsData() {
        // Initialize materials data structure based on the Documents folder
        this.materialsData = {
            1: {
                name: "Semester 1",
                subjects: {
                    "Basic Electrical and Electronics": {
                        icon: "fa-bolt",
                        categories: {
                            "Assignments": { icon: "fa-tasks", count: 5, files: ["Assignment 1.pdf", "Assignment 2.pdf", "Lab Report 1.docx", "Circuit Analysis.pdf", "Project Report.pdf"] },
                            "Lectures": { icon: "fa-chalkboard-teacher", count: 12, files: ["Lecture 1 - Introduction.pdf", "Lecture 2 - Ohm's Law.pdf", "Lecture 3 - Kirchhoff's Laws.pdf"] },
                            "Online docs": { icon: "fa-globe", count: 8, files: ["Online Resource 1.pdf", "Web Tutorial.html", "Interactive Simulation.pdf"] },
                            "Sample Papers": { icon: "fa-file-alt", count: 6, files: ["Sample Paper 1.pdf", "Sample Paper 2.pdf", "Previous Year QP.pdf"] }
                        }
                    },
                    "Constitution of India": {
                        icon: "fa-balance-scale",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 3, files: ["Constitution Basics.docx", "Fundamental Rights.pptx", "Directive Principles.pdf"] }
                        }
                    },
                    "Engineering Graphics": {
                        icon: "fa-drafting-compass",
                        categories: {
                            "Assignments": { icon: "fa-tasks", count: 8, files: ["Drawing Assignment 1.pdf", "CAD Exercise.dwg", "Projection Problems.pdf"] },
                            "Lectures": { icon: "fa-chalkboard-teacher", count: 15, files: ["Introduction to Graphics.pdf", "Orthographic Projection.pdf", "Isometric Drawing.pdf"] },
                            "Notes": { icon: "fa-sticky-note", count: 10, files: ["Graphics Theory.pdf", "Drawing Standards.pdf", "CAD Commands.pdf"] }
                        }
                    },
                    "English": {
                        icon: "fa-language",
                        categories: {
                            "Lectures": { icon: "fa-chalkboard-teacher", count: 12, files: ["Grammar Basics.pdf", "Essay Writing.pdf", "Communication Skills.pdf"] },
                            "PDFs": { icon: "fa-file-pdf", count: 8, files: ["English Grammar.pdf", "Vocabulary Builder.pdf", "Reading Comprehension.pdf"] },
                            "Sample Papers": { icon: "fa-file-alt", count: 5, files: ["English Sample 1.pdf", "English Sample 2.pdf", "Previous Year.pdf"] }
                        }
                    },
                    "Mathematics": {
                        icon: "fa-calculator",
                        categories: {
                            "Assignments": { icon: "fa-tasks", count: 10, files: ["Calculus Assignment.pdf", "Algebra Problems.pdf", "Trigonometry Exercises.pdf"] },
                            "Lectures": { icon: "fa-chalkboard-teacher", count: 20, files: ["Differential Calculus.pdf", "Integral Calculus.pdf", "Linear Algebra.pdf"] },
                            "Sample question papers": { icon: "fa-file-alt", count: 8, files: ["Math Sample 1.pdf", "Math Sample 2.pdf", "Previous Years.pdf"] }
                        }
                    },
                    "Semiconductor Physics": {
                        icon: "fa-microchip",
                        categories: {
                            "Assignments": { icon: "fa-tasks", count: 6, files: ["Physics Assignment 1.pdf", "Lab Report.pdf", "Semiconductor Analysis.pdf"] },
                            "Lab": { icon: "fa-flask", count: 8, files: ["Lab Manual.pdf", "Experiment 1.pdf", "Lab Safety.pdf"] },
                            "Lectures": { icon: "fa-chalkboard-teacher", count: 18, files: ["Semiconductor Basics.pdf", "PN Junction.pdf", "Transistors.pdf"] },
                            "Question Papers": { icon: "fa-file-alt", count: 5, files: ["Physics QP 1.pdf", "Physics QP 2.pdf", "Previous Year.pdf"] },
                            "Sample papers": { icon: "fa-file-alt", count: 4, files: ["Sample 1.pdf", "Sample 2.pdf", "Mock Test.pdf"] }
                        }
                    }
                }
            },
            2: {
                name: "Semester 2",
                subjects: {
                    "Advanced Calculus and Complex Analysis": {
                        icon: "fa-square-root-alt",
                        categories: {
                            "General Formulas": { icon: "fa-formula", count: 5, files: ["Calculus Formulas.pdf", "Complex Analysis Formulas.pdf"] },
                            "Question Banks": { icon: "fa-question-circle", count: 8, files: ["Question Bank 1.pdf", "Question Bank 2.pdf"] },
                            "Unit 1": { icon: "fa-book", count: 6, files: ["Unit 1 Notes.pdf", "Unit 1 Examples.pdf"] },
                            "Unit 3": { icon: "fa-book", count: 7, files: ["Unit 3 Notes.pdf", "Unit 3 Problems.pdf"] },
                            "Unit 4": { icon: "fa-book", count: 6, files: ["Unit 4 Theory.pdf", "Unit 4 Applications.pdf"] },
                            "Unit 5": { icon: "fa-book", count: 5, files: ["Unit 5 Summary.pdf", "Unit 5 Practice.pdf"] }
                        }
                    },
                    "Civil and Mechanical Workshop": {
                        icon: "fa-tools",
                        categories: {
                            "Lab Manuals": { icon: "fa-book", count: 7, files: ["Sheet metal work.pdf", "Fitting.pdf", "fitting shop.pdf", "lathe manual.pdf", "Lathe.pdf", "welding.pdf", "WORKSHOP MANUAL SRMIST TRC.pdf"] }
                        }
                    },
                    "French": {
                        icon: "fa-flag",
                        categories: {
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["French QB 1.pdf", "French QB 2.pdf"] },
                            "Unit 1": { icon: "fa-book", count: 6, files: ["French Basics.pdf", "Grammar Unit 1.pdf"] }
                        }
                    },
                    "General Aptitude": {
                        icon: "fa-brain",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 3, files: ["18PDH101T - 2ND SEM.pdf", "18PDH101T - A-1.pdf", "18PDH101T - A.pdf"] }
                        }
                    },
                    "Programming and Problem Solving": {
                        icon: "fa-code",
                        categories: {
                            "Lecture Notes": { icon: "fa-chalkboard-teacher", count: 15, files: ["History of C and features.pdf", "Constants, keywords,datatypes.pdf", "operators.pdf", "controlstatements.pdf", "InputOutputFunction.pdf", "iterations1.pdf", "arrays.pdf", "STRINGS only.pdf", "strings1-3.pdf", "strings1.pdf", "PASSING ARRAY AS AN ARGUMENT IN FUNCTION.pptx.pdf", "pps 2D ARRAY BASICS slide.pdf"] },
                            "Unit Notes": { icon: "fa-book", count: 5, files: ["Unit 1.pdf", "Unit 2.pdf", "Unit 3.pdf", "Unit 4.pdf", "Unit 5.pdf"] },
                            "CLA 3": { icon: "fa-tasks", count: 4, files: ["CLA 3 Questions.pdf", "CLA 3 Solutions.pdf"] },
                            "Notes Unit 1 to 5": { icon: "fa-sticky-note", count: 8, files: ["Comprehensive Notes.pdf", "All Units Summary.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 6, files: ["PPS Question Bank.pdf", "Previous Years.pdf"] }
                        }
                    }
                }
            },
            3: {
                name: "Semester 3",
                subjects: {
                    "Analog and Digital Electronics": {
                        icon: "fa-microchip",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 2, files: ["ade_important_topics.jpg", "Ade.pdf"] },
                            "ADE Practical": { icon: "fa-flask", count: 5, files: ["Lab Manual.pdf", "Practical 1.pdf"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["CLA1 Questions.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["CLA2 Questions.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["CLA3 Questions.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["ADE Question Bank.pdf"] }
                        }
                    },
                    "Biology": {
                        icon: "fa-dna",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 2, files: ["Links.docx", "syllabus_bio_1.pdf"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["Bio CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["Bio CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["Bio CLA3.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["Biology QB.pdf"] }
                        }
                    },
                    "Computer Organization and Architecture": {
                        icon: "fa-server",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 1, files: ["COA IMPORTANT QUESTIONS.pdf"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["COA CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["COA CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["COA CLA3.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["COA Question Bank.pdf"] }
                        }
                    },
                    "Data Structures and Algorithm": {
                        icon: "fa-project-diagram",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 1, files: ["Important Topics.docx"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["DSA CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["DSA CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["DSA CLA3.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["DSA Question Bank.pdf"] }
                        }
                    },
                    "Management Principles for Engineers": {
                        icon: "fa-chart-line",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 3, files: ["MPE Master List.pdf", "mpe-01.jpg", "mpe-02.jpg"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["MPE Question Bank.pdf"] },
                            "Unit 1": { icon: "fa-book", count: 4, files: ["Unit 1 Notes.pdf"] },
                            "Unit 2": { icon: "fa-book", count: 4, files: ["Unit 2 Notes.pdf"] },
                            "Unit 3": { icon: "fa-book", count: 4, files: ["Unit 3 Notes.pdf"] },
                            "Unit 4 & 5": { icon: "fa-book", count: 6, files: ["Unit 4 Notes.pdf", "Unit 5 Notes.pdf"] }
                        }
                    },
                    "Object Oriented Design and Programming": {
                        icon: "fa-object-group",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 1, files: ["Links.docx"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["OODP CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["OODP CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["OODP CLA3.pdf"] },
                            "Lab": { icon: "fa-flask", count: 5, files: ["Lab Manual.pdf", "Lab Programs.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["OODP Question Bank.pdf"] },
                            "Syllabus": { icon: "fa-list", count: 1, files: ["OODP Syllabus.pdf"] }
                        }
                    },
                    "Transforms and Boundary value problems": {
                        icon: "fa-wave-square",
                        categories: {
                            "Important topics": { icon: "fa-star", count: 3, files: ["Important Topics.pdf"] },
                            "Question banks and formulae": { icon: "fa-question-circle", count: 5, files: ["Question Bank.pdf", "Formulas.pdf"] },
                            "Unit 1": { icon: "fa-book", count: 4, files: ["Unit 1 Notes.pdf"] },
                            "Unit 2": { icon: "fa-book", count: 4, files: ["Unit 2 Notes.pdf"] },
                            "Unit 3": { icon: "fa-book", count: 4, files: ["Unit 3 Notes.pdf"] },
                            "Unit 4": { icon: "fa-book", count: 4, files: ["Unit 4 Notes.pdf"] },
                            "Unit 5": { icon: "fa-book", count: 4, files: ["Unit 5 Notes.pdf"] }
                        }
                    }
                }
            },
            4: {
                name: "Semester 4",
                subjects: {
                    "Advanced Programming Practices": {
                        icon: "fa-code",
                        categories: {
                            "Book": { icon: "fa-book", count: 2, files: ["APP Textbook.pdf"] },
                            "CLA 1": { icon: "fa-tasks", count: 3, files: ["APP CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["APP CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["APP CLA3.pdf"] },
                            "Question banks and Important topics": { icon: "fa-question-circle", count: 5, files: ["APP Question Bank.pdf", "Important Topics.pdf"] }
                        }
                    },
                    "Computer Communications": {
                        icon: "fa-network-wired",
                        categories: {
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["CC CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["CC CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["CC CLA3.pdf"] },
                            "Question Banks": { icon: "fa-question-circle", count: 4, files: ["CC Question Bank.pdf"] }
                        }
                    },
                    "Design and Analysis of Algorithms": {
                        icon: "fa-sitemap",
                        categories: {
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["DAA CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["DAA CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["DAA CLA3.pdf"] },
                            "Question Banks": { icon: "fa-question-circle", count: 4, files: ["DAA Question Bank.pdf"] }
                        }
                    },
                    "Operating System": {
                        icon: "fa-desktop",
                        categories: {
                            "CLA 1": { icon: "fa-tasks", count: 3, files: ["OS CLA1.pdf"] },
                            "CLA 2": { icon: "fa-tasks", count: 3, files: ["OS CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["OS CLA3.pdf"] },
                            "Lab": { icon: "fa-flask", count: 5, files: ["OS Lab Manual.pdf"] },
                            "Question bank": { icon: "fa-question-circle", count: 4, files: ["OS Question Bank.pdf"] }
                        }
                    },
                    "Probability and Queueing Theory": {
                        icon: "fa-chart-bar",
                        categories: {
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["PQT CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["PQT CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["PQT CLA3.pdf"] },
                            "Question Bank": { icon: "fa-question-circle", count: 4, files: ["PQT Question Bank.pdf"] }
                        }
                    },
                    "Social Engineering": {
                        icon: "fa-users",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 7, files: ["ALL MCQ.pdf", "imp questions se unit 1.pdf", "MCQ+NOTES.pdf", "Question bank _Social Engineering.pdf", "SE 29 MCQ ANSWERS.pdf", "SE QP 2022.pdf", "Social Engineering Unit 1 - Student copy.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["SE CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["SE CLA3.pdf"] }
                        }
                    },
                    "Software Engineering and Product Development": {
                        icon: "fa-cogs",
                        categories: {
                            "Syllabus": { icon: "fa-list", count: 1, files: ["SEPM Syllabus.pdf"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["SEPM CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["SEPM CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["SEPM CLA3.pdf"] },
                            "Lab": { icon: "fa-flask", count: 5, files: ["SEPM Lab Manual.pdf"] },
                            "Question Banks": { icon: "fa-question-circle", count: 4, files: ["SEPM Question Bank.pdf"] }
                        }
                    }
                }
            },
            5: {
                name: "Semester 5",
                subjects: {
                    "Artificial Neural Networks": {
                        icon: "fa-brain",
                        categories: {
                            "Syllabus": { icon: "fa-list", count: 1, files: ["ANN - Syllabus.pdf"] },
                            "CLA1": { icon: "fa-tasks", count: 3, files: ["ANN CLA1.pdf"] },
                            "CLA2": { icon: "fa-tasks", count: 3, files: ["ANN CLA2.pdf"] },
                            "CLA3": { icon: "fa-tasks", count: 3, files: ["ANN CLA3.pdf"] }
                        }
                    },
                    "Computer Networks": {
                        icon: "fa-network-wired",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 5, files: ["CN Notes.pdf", "Network Protocols.pdf"] }
                        }
                    },
                    "Computer Vision": {
                        icon: "fa-eye",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 4, files: ["CV Basics.pdf", "Image Processing.pdf"] }
                        }
                    },
                    "Discrete Mathematics for Engineers": {
                        icon: "fa-calculator",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 6, files: ["Discrete Math.pdf", "Graph Theory.pdf"] }
                        }
                    },
                    "Formal Language Automata": {
                        icon: "fa-robot",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 5, files: ["Automata Theory.pdf", "Formal Languages.pdf"] }
                        }
                    },
                    "Sensors and Transducers": {
                        icon: "fa-satellite-dish",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 4, files: ["Sensors Basics.pdf", "Transducers.pdf"] }
                        }
                    }
                }
            },
            6: {
                name: "Semester 6",
                subjects: {
                    "Applied Machine Learning": {
                        icon: "fa-robot",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 6, files: ["ML Algorithms.pdf", "Applied ML.pdf"] }
                        }
                    },
                    "Artificial Intelligence": {
                        icon: "fa-brain",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 7, files: ["AI Fundamentals.pdf", "Expert Systems.pdf"] }
                        }
                    },
                    "Compiler Design": {
                        icon: "fa-code",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 5, files: ["Compiler Phases.pdf", "Lexical Analysis.pdf"] }
                        }
                    },
                    "Database Management System": {
                        icon: "fa-database",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 8, files: ["DBMS Concepts.pdf", "SQL Queries.pdf"] }
                        }
                    },
                    "Digital Image Processing": {
                        icon: "fa-image",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 5, files: ["Image Processing.pdf", "Filters.pdf"] }
                        }
                    },
                    "Employability Skills and Practices": {
                        icon: "fa-briefcase",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 4, files: ["Soft Skills.pdf", "Interview Prep.pdf"] }
                        }
                    },
                    "Industrial Safety and Environment": {
                        icon: "fa-hard-hat",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 3, files: ["Safety Protocols.pdf", "Environment.pdf"] }
                        }
                    }
                }
            },
            7: {
                name: "Semester 7",
                subjects: {
                    "Genetic Algorithms and its Applications": {
                        icon: "fa-dna",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 4, files: ["Genetic Algorithms.pdf", "Applications.pdf"] }
                        }
                    },
                    "Statistical Machine Learning": {
                        icon: "fa-chart-line",
                        categories: {
                            "Notes": { icon: "fa-sticky-note", count: 5, files: ["Statistical ML.pdf", "Probability.pdf"] }
                        }
                    }
                }
            }
        };
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterAndDisplayMaterials();
            });
        }

        // Filter functionality
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFilterMenu();
            });
        }

        // Filter checkboxes
        const filterCheckboxes = document.querySelectorAll('.filter-menu input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
                this.filterAndDisplayMaterials();
            });
        });

        // Semester tabs
        const semesterTabs = document.querySelectorAll('.semester-tab');
        semesterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSemester(tab.dataset.semester);
            });
        });

        // Close filter menu when clicking outside
        document.addEventListener('click', (e) => {
            const filterMenu = document.getElementById('filterMenu');
            const filterBtn = document.querySelector('.filter-btn');
            if (filterMenu && !filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
                filterMenu.classList.remove('active');
            }
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeMaterialModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMaterialModal();
            }
        });
    }

    toggleFilterMenu() {
        const filterMenu = document.getElementById('filterMenu');
        if (filterMenu) {
            filterMenu.classList.toggle('active');
        }
    }

    updateFilters() {
        const materialTypeCheckboxes = document.querySelectorAll('.filter-menu input[value="notes"], .filter-menu input[value="assignments"], .filter-menu input[value="question-papers"], .filter-menu input[value="lab"]');
        const semesterCheckboxes = document.querySelectorAll('.filter-menu input[value="all"], .filter-menu input[value="1"], .filter-menu input[value="2"], .filter-menu input[value="3"], .filter-menu input[value="4"], .filter-menu input[value="5"], .filter-menu input[value="6"], .filter-menu input[value="7"]');

        this.activeFilters.materialTypes = [];
        this.activeFilters.semesters = [];

        materialTypeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.activeFilters.materialTypes.push(checkbox.value);
            }
        });

        semesterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.activeFilters.semesters.push(checkbox.value);
            }
        });
    }

    switchSemester(semester) {
        this.currentSemester = semester;
        
        // Update active tab
        document.querySelectorAll('.semester-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-semester="${semester}"]`).classList.add('active');

        this.loadMaterials();
    }

    loadMaterials() {
        this.showLoading();
        
        // Simulate loading delay
        setTimeout(() => {
            this.displayMaterials();
            this.hideLoading();
        }, 500);
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const materialsGrid = document.getElementById('materialsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (loadingState) loadingState.style.display = 'flex';
        if (materialsGrid) materialsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'none';
    }

    displayMaterials() {
        const materialsGrid = document.getElementById('materialsGrid');
        if (!materialsGrid) return;

        materialsGrid.innerHTML = '';
        materialsGrid.style.display = 'grid';

        let hasResults = false;

        if (this.currentSemester === 'all') {
            // Display all semesters
            Object.keys(this.materialsData).forEach(semesterNum => {
                const semester = this.materialsData[semesterNum];
                Object.keys(semester.subjects).forEach(subjectName => {
                    const subject = semester.subjects[subjectName];
                    if (this.matchesFilters(subjectName, subject, semesterNum)) {
                        const subjectCard = this.createSubjectCard(subjectName, subject, semesterNum);
                        materialsGrid.appendChild(subjectCard);
                        hasResults = true;
                    }
                });
            });
        } else {
            // Display specific semester
            const semester = this.materialsData[this.currentSemester];
            if (semester) {
                Object.keys(semester.subjects).forEach(subjectName => {
                    const subject = semester.subjects[subjectName];
                    if (this.matchesFilters(subjectName, subject, this.currentSemester)) {
                        const subjectCard = this.createSubjectCard(subjectName, subject, this.currentSemester);
                        materialsGrid.appendChild(subjectCard);
                        hasResults = true;
                    }
                });
            }
        }

        // Show empty state if no results
        if (!hasResults) {
            this.showEmptyState();
        }
    }

    matchesFilters(subjectName, subject, semesterNum) {
        // Check search query
        if (this.searchQuery && !subjectName.toLowerCase().includes(this.searchQuery)) {
            let matchesCategory = false;
            Object.keys(subject.categories).forEach(categoryName => {
                if (categoryName.toLowerCase().includes(this.searchQuery)) {
                    matchesCategory = true;
                }
            });
            if (!matchesCategory) return false;
        }

        // Check semester filter
        if (!this.activeFilters.semesters.includes('all') && !this.activeFilters.semesters.includes(semesterNum)) {
            return false;
        }

        return true;
    }

    createSubjectCard(subjectName, subject, semesterNum) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        const totalMaterials = Object.values(subject.categories).reduce((total, category) => total + category.count, 0);
        
        card.innerHTML = `
            <div class="subject-header">
                <div class="subject-title">
                    <i class="fas ${subject.icon}"></i>
                    ${subjectName}
                </div>
                <div class="subject-meta">
                    <span class="meta-badge">Semester ${semesterNum}</span>
                    <span>${totalMaterials} Materials</span>
                </div>
            </div>
            <div class="subject-body">
                <div class="material-categories">
                    ${Object.keys(subject.categories).map(categoryName => {
                        const category = subject.categories[categoryName];
                        return `
                            <div class="category-item" onclick="toggleMaterialList('${subjectName}', '${categoryName}')">
                                <div class="category-info">
                                    <div class="category-icon">
                                        <i class="fas ${category.icon}"></i>
                                    </div>
                                    <span class="category-name">${categoryName}</span>
                                </div>
                                <span class="category-count">${category.count}</span>
                            </div>
                            <div class="material-list" id="materials-${subjectName.replace(/\s+/g, '-')}-${categoryName.replace(/\s+/g, '-')}">
                                ${category.files.map(fileName => `
                                    <div class="material-item" onclick="openMaterialModal('${fileName}', '${subjectName}', '${categoryName}')">
                                        <div class="material-info">
                                            <div class="material-icon">
                                                <i class="fas ${this.getFileIcon(fileName)}"></i>
                                            </div>
                                            <span class="material-name">${fileName}</span>
                                        </div>
                                        <div class="material-actions">
                                            <button class="action-btn" onclick="event.stopPropagation(); downloadMaterialDirect('${fileName}', '${subjectName}', '${categoryName}')" title="Download">
                                                <i class="fas fa-download"></i>
                                            </button>
                                            <button class="action-btn" onclick="event.stopPropagation(); viewMaterialDirect('${fileName}', '${subjectName}', '${categoryName}')" title="View">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        return card;
    }

    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'ppt': 'fa-file-powerpoint',
            'pptx': 'fa-file-powerpoint',
            'xls': 'fa-file-excel',
            'xlsx': 'fa-file-excel',
            'txt': 'fa-file-alt',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'mp4': 'fa-file-video',
            'avi': 'fa-file-video',
            'mp3': 'fa-file-audio',
            'wav': 'fa-file-audio',
            'zip': 'fa-file-archive',
            'rar': 'fa-file-archive',
            'html': 'fa-file-code',
            'css': 'fa-file-code',
            'js': 'fa-file-code',
            'dwg': 'fa-file-alt'
        };
        return iconMap[extension] || 'fa-file';
    }

    showEmptyState() {
        const materialsGrid = document.getElementById('materialsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (materialsGrid) materialsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    }

    filterAndDisplayMaterials() {
        this.displayMaterials();
    }

    openMaterialModal(fileName, subjectName, categoryName) {
        this.selectedMaterial = {
            fileName: fileName,
            subjectName: subjectName,
            categoryName: categoryName
        };

        const modal = document.getElementById('materialModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIcon');
        const modalMaterialName = document.getElementById('modalMaterialName');
        const modalMaterialPath = document.getElementById('modalMaterialPath');
        const modalDate = document.getElementById('modalDate');
        const modalType = document.getElementById('modalType');

        if (modalTitle) modalTitle.textContent = 'Material Details';
        if (modalIcon) modalIcon.innerHTML = `<i class="fas ${this.getFileIcon(fileName)}"></i>`;
        if (modalMaterialName) modalMaterialName.textContent = fileName;
        if (modalMaterialPath) modalMaterialPath.textContent = `${subjectName} > ${categoryName}`;
        if (modalDate) modalDate.textContent = 'Available';
        if (modalType) modalType.textContent = this.getFileType(fileName);

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Track activity
        if (window.addDashboardActivity) {
            window.addDashboardActivity('download', 'Viewed Material Details', `${subjectName} - ${fileName}`);
        }
    }

    closeMaterialModal() {
        const modal = document.getElementById('materialModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.selectedMaterial = null;
    }

    getFileType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'ppt': 'PowerPoint Presentation',
            'pptx': 'PowerPoint Presentation',
            'xls': 'Excel Spreadsheet',
            'xlsx': 'Excel Spreadsheet',
            'txt': 'Text File',
            'jpg': 'Image File',
            'jpeg': 'Image File',
            'png': 'Image File',
            'gif': 'Image File',
            'mp4': 'Video File',
            'avi': 'Video File',
            'mp3': 'Audio File',
            'wav': 'Audio File',
            'zip': 'Archive File',
            'rar': 'Archive File',
            'html': 'HTML File',
            'css': 'CSS File',
            'js': 'JavaScript File',
            'dwg': 'CAD Drawing'
        };
        return typeMap[extension] || 'Unknown File';
    }

    downloadMaterial() {
        if (!this.selectedMaterial) return;

        const { fileName, subjectName, categoryName } = this.selectedMaterial;
        
        // In a real application, this would trigger an actual download
        // For now, we'll simulate the download and show a message
        this.simulateDownload(fileName, subjectName, categoryName);
        
        // Track activity
        if (window.addDashboardActivity) {
            window.addDashboardActivity('download', 'Downloaded Material', `${subjectName} - ${fileName}`);
        }
        
        this.closeMaterialModal();
    }

    viewMaterial() {
        if (!this.selectedMaterial) return;

        const { fileName, subjectName, categoryName } = this.selectedMaterial;
        
        // In a real application, this would open the file in a viewer
        // For now, we'll simulate viewing
        this.simulateView(fileName, subjectName, categoryName);
        
        // Track activity
        if (window.addDashboardActivity) {
            window.addDashboardActivity('download', 'Viewed Material', `${subjectName} - ${fileName}`);
        }
        
        this.closeMaterialModal();
    }

    simulateDownload(fileName, subjectName, categoryName) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-download"></i>
                <span>Downloading ${fileName}...</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-gradient);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`Downloading: ${fileName} from ${subjectName} > ${categoryName}`);
    }

    simulateView(fileName, subjectName, categoryName) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'view-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-eye"></i>
                <span>Opening ${fileName}...</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-gradient);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`Viewing: ${fileName} from ${subjectName} > ${categoryName}`);
    }
}

// Global functions for HTML onclick events
function toggleMaterialList(subjectName, categoryName) {
    const listId = `materials-${subjectName.replace(/\s+/g, '-')}-${categoryName.replace(/\s+/g, '-')}`;
    const materialList = document.getElementById(listId);
    
    if (materialList) {
        materialList.classList.toggle('active');
    }
}

function openMaterialModal(fileName, subjectName, categoryName) {
    if (window.semestersManager) {
        window.semestersManager.openMaterialModal(fileName, subjectName, categoryName);
    }
}

function closeMaterialModal() {
    if (window.semestersManager) {
        window.semestersManager.closeMaterialModal();
    }
}

function downloadMaterial() {
    if (window.semestersManager) {
        window.semestersManager.downloadMaterial();
    }
}

function viewMaterial() {
    if (window.semestersManager) {
        window.semestersManager.viewMaterial();
    }
}

function downloadMaterialDirect(fileName, subjectName, categoryName) {
    if (window.semestersManager) {
        window.semestersManager.selectedMaterial = { fileName, subjectName, categoryName };
        window.semestersManager.downloadMaterial();
    }
}

function viewMaterialDirect(fileName, subjectName, categoryName) {
    if (window.semestersManager) {
        window.semestersManager.selectedMaterial = { fileName, subjectName, categoryName };
        window.semestersManager.viewMaterial();
    }
}

function toggleFilterMenu() {
    if (window.semestersManager) {
        window.semestersManager.toggleFilterMenu();
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const semestersManager = new SemestersManager();
    window.semestersManager = semestersManager;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SemestersManager;
}
