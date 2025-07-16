// Simple Timer JavaScript

class SimpleTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 25 * 60; // 25 minutes in seconds (default)
        this.defaultTime = 25 * 60;
        this.totalSessions = 0;
        this.totalFocusTime = 0;
        
        this.timer = null;
        this.progressRing = document.querySelector('.progress-ring-progress');
        this.circumference = 2 * Math.PI * 140; // radius = 140
        
        this.initializeProgressRing();
        this.loadStats();
        this.updateDisplay();
        this.updateStats();
        this.setupTimeInput();
    }
    
    initializeProgressRing() {
        if (this.progressRing) {
            this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
            this.progressRing.style.strokeDashoffset = this.circumference;
        }
    }
    
    updateProgressRing(timeLeft, totalTime) {
        if (this.progressRing) {
            const progress = (totalTime - timeLeft) / totalTime;
            const offset = this.circumference - progress * this.circumference;
            this.progressRing.style.strokeDashoffset = offset;
        }
    }
    
    setupTimeInput() {
        // Add time input controls
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.style.cursor = 'pointer';
            timerDisplay.title = 'Click to set custom time';
            
            timerDisplay.addEventListener('click', () => {
                if (!this.isRunning) {
                    this.showTimeInput();
                }
            });
        }
    }
    
    showTimeInput() {
        const minutes = Math.floor(this.currentTime / 60);
        const newMinutes = prompt(`Enter timer duration in minutes:`, minutes);
        
        if (newMinutes !== null && !isNaN(newMinutes) && newMinutes > 0) {
            this.currentTime = parseInt(newMinutes) * 60;
            this.defaultTime = this.currentTime;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerDisplay = document.getElementById('timerDisplay');
        const timerLabel = document.getElementById('timerLabel');
        const sessionCount = document.getElementById('sessionCount');
        
        if (timerDisplay) timerDisplay.textContent = timeString;
        if (timerLabel) timerLabel.textContent = 'Study Timer';
        if (sessionCount) sessionCount.textContent = `Session ${this.totalSessions + 1}`;
        
        this.updateProgressRing(this.currentTime, this.defaultTime);
        
        // Update page title with timer
        if (this.isRunning) {
            document.title = `${timeString} - HELPER SRM Timer`;
        } else {
            document.title = 'Study Timer - HELPER SRM';
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'flex';
            
            this.timer = setInterval(() => {
                this.currentTime--;
                this.updateDisplay();
                
                if (this.currentTime <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            
            clearInterval(this.timer);
            
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) startBtn.style.display = 'flex';
            if (pauseBtn) pauseBtn.style.display = 'none';
            
            document.title = 'Study Timer - HELPER SRM';
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.timer);
        
        this.currentTime = this.defaultTime;
        this.updateDisplay();
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) startBtn.style.display = 'flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        
        document.title = 'Study Timer - HELPER SRM';
    }
    
    completeSession() {
        this.isRunning = false;
        clearInterval(this.timer);
        
        this.playAlarm();
        this.totalSessions++;
        this.totalFocusTime += Math.floor(this.defaultTime / 60);
        this.updateStats();
        this.saveStats();
        
        // Show completion notification
        this.showNotification('Timer Complete!', 'Great job! Take a break.');
        
        // Reset for next session
        this.currentTime = this.defaultTime;
        this.updateDisplay();
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) startBtn.style.display = 'flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        
        document.title = 'Study Timer - HELPER SRM';
    }
    
    playAlarm() {
        // Create alarm sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a series of beeps
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                }, i * 600);
            }
        } catch (e) {
            console.log('Could not play alarm sound:', e);
            // Fallback: try to use HTML5 audio if available
            try {
                const audio = document.getElementById('alarmSound');
                if (audio) {
                    audio.play();
                }
            } catch (fallbackError) {
                console.log('Fallback audio also failed:', fallbackError);
            }
        }
    }
    
    showNotification(title, message) {
        // Try to show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/favicon.ico'
                    });
                }
            });
        }
        
        // Also show visual notification
        const notification = document.createElement('div');
        notification.className = 'timer-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    saveStats() {
        localStorage.setItem('timerStats', JSON.stringify({
            totalSessions: this.totalSessions,
            totalFocusTime: this.totalFocusTime
        }));
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('timerStats');
        
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            this.totalSessions = stats.totalSessions || 0;
            this.totalFocusTime = stats.totalFocusTime || 0;
        }
    }
    
    updateStats() {
        const completedSessions = document.getElementById('completedSessions');
        const totalFocusTime = document.getElementById('totalFocusTime');
        const totalBreaks = document.getElementById('totalBreaks');
        const productivity = document.getElementById('productivity');
        
        if (completedSessions) completedSessions.textContent = this.totalSessions;
        
        if (totalFocusTime) {
            const hours = Math.floor(this.totalFocusTime / 60);
            const minutes = this.totalFocusTime % 60;
            totalFocusTime.textContent = `${hours}h ${minutes}m`;
        }
        
        if (totalBreaks) totalBreaks.textContent = '0';
        
        if (productivity) {
            const productivityScore = this.totalSessions > 0 ? 100 : 0;
            productivity.textContent = productivityScore + '%';
        }
    }
}

// Initialize timer when page loads
let simpleTimer;

document.addEventListener('DOMContentLoaded', function() {
    simpleTimer = new SimpleTimer();
    
    // Request notification permission on load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Global functions for button clicks
function startTimer() {
    if (simpleTimer) simpleTimer.start();
}

function pauseTimer() {
    if (simpleTimer) simpleTimer.pause();
}

function resetTimer() {
    if (simpleTimer) simpleTimer.reset();
}

// Add CSS for notification animation
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
    
    .notification-content {
        text-align: center;
    }
    
    .notification-content h3 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }
    
    .notification-content p {
        margin: 0 0 15px 0;
        opacity: 0.9;
    }
    
    .notification-content button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .notification-content button:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;
document.head.appendChild(style);
