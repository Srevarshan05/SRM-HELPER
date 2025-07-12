
// AI Assistant JavaScript
class AIAssistant {
    constructor() {
        this.apiConfig = {
            provider: 'gemini',
            apiKey: '',
            model: 'gemini-pro'
        };
        this.chatHistory = [];
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.loadApiConfig();
        this.setupEventListeners();
        this.setupFileUpload();
        this.autoResizeTextarea();
    }
    
    setupEventListeners() {
        // Auto-resize textarea
        const chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('input', this.autoResizeTextarea);
        
        // File upload click
        document.getElementById('fileUploadArea').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        // Drag and drop
        const uploadArea = document.getElementById('fileUploadArea');
        uploadArea.addEventListener('dragover', this.handleDragOver);
        uploadArea.addEventListener('dragleave', this.handleDragLeave);
        uploadArea.addEventListener('drop', this.handleDrop);
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    autoResizeTextarea() {
        const textarea = document.getElementById('chatInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        this.handleFiles(e.dataTransfer.files);
    }
    
    handleFiles(files) {
        Array.from(files).forEach(file => {
            this.uploadFile(file);
        });
    }
    
    uploadFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.addMessage('user', `📎 Uploaded: ${file.name}`, true);
            this.processDocument(file.name, content);
        };
        
        if (file.type.startsWith('text/')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    
    processDocument(filename, content) {
        const message = `I've uploaded a document: ${filename}. Please analyze it and provide a summary.`;
        this.sendToAI(message, content);
    }
    
    addMessage(sender, text, isFile = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageDiv;
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async sendToAI(message, documentContent = null) {
        if (!this.apiConfig.apiKey) {
            this.addMessage('bot', '⚠️ Please configure your API key first to use the AI assistant.');
            return;
        }
        
        this.showTypingIndicator();
        
        try {
            let response;
            
            switch (this.apiConfig.provider) {
                case 'gemini':
                    response = await this.callGeminiAPI(message, documentContent);
                    break;
                case 'groq':
                    response = await this.callGroqAPI(message, documentContent);
                    break;
                case 'openai':
                    response = await this.callOpenAIAPI(message, documentContent);
                    break;
                default:
                    throw new Error('Unsupported API provider');
            }
            
            this.hideTypingIndicator();
            this.addMessage('bot', response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', `❌ Error: ${error.message}`);
        }
    }
    
    async callGeminiAPI(message, documentContent) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.apiConfig.model}:generateContent?key=${this.apiConfig.apiKey}`;
        
        let prompt = message;
        if (documentContent) {
            prompt = `Document content: ${documentContent}\n\nUser question: ${message}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    async callGroqAPI(message, documentContent) {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        
        let content = message;
        if (documentContent) {
            content = `Document content: ${documentContent}\n\nUser question: ${message}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI study assistant. Provide clear, accurate, and educational responses.'
                    },
                    {
                        role: 'user',
                        content: content
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    async callOpenAIAPI(message, documentContent) {
        const url = 'https://api.openai.com/v1/chat/completions';
        
        let content = message;
        if (documentContent) {
            content = `Document content: ${documentContent}\n\nUser question: ${message}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConfig.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI study assistant. Provide clear, accurate, and educational responses.'
                    },
                    {
                        role: 'user',
                        content: content
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    updateApiConfig() {
        const provider = document.getElementById('apiProvider').value;
        const modelSelect = document.getElementById('model');
        
        // Update model options based on provider
        modelSelect.innerHTML = '';
        
        switch (provider) {
            case 'gemini':
                modelSelect.innerHTML = `
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                `;
                break;
            case 'groq':
                modelSelect.innerHTML = `
                    <option value="llama2-70b-4096">Llama 2 70B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                `;
                break;
            case 'openai':
                modelSelect.innerHTML = `
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                `;
                break;
        }
        
        this.apiConfig.provider = provider;
        this.apiConfig.model = modelSelect.value;
        this.saveApiConfig();
    }
    
    saveApiConfig() {
        this.apiConfig.apiKey = document.getElementById('apiKey').value;
        this.apiConfig.model = document.getElementById('model').value;
        
        localStorage.setItem('aiAssistantConfig', JSON.stringify(this.apiConfig));
        
        // Update status
        const status = document.getElementById('configStatus');
        if (this.apiConfig.apiKey) {
            status.className = 'config-status success';
            status.innerHTML = '<i class="fas fa-check-circle"></i><span>API configured successfully!</span>';
        } else {
            status.className = 'config-status';
            status.innerHTML = '<i class="fas fa-info-circle"></i><span>Enter your API key to start using the AI assistant</span>';
        }
    }
    
    loadApiConfig() {
        const saved = localStorage.getItem('aiAssistantConfig');
        if (saved) {
            this.apiConfig = { ...this.apiConfig, ...JSON.parse(saved) };
        }
        
        // Update form values
        document.getElementById('apiProvider').value = this.apiConfig.provider;
        document.getElementById('apiKey').value = this.apiConfig.apiKey;
        this.updateApiConfig();
        
        // Update status
        this.saveApiConfig();
    }
}

// Global functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    window.aiAssistant.addMessage('user', message);
    
    // Send to AI
    window.aiAssistant.sendToAI(message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function insertSuggestion(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    input.focus();
    window.aiAssistant.autoResizeTextarea();
}

function updateApiConfig() {
    window.aiAssistant.updateApiConfig();
}

function saveApiConfig() {
    window.aiAssistant.saveApiConfig();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
    
    // Add loading animation
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.opacity = '0';
    chatContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        chatContainer.style.transition = 'all 0.6s ease';
        chatContainer.style.opacity = '1';
        chatContainer.style.transform = 'translateY(0)';
    }, 200);
    
    // Add sample interactions
    setTimeout(() => {
        const suggestions = [
            "Try asking: 'Explain quantum physics in simple terms'",
            "Upload a document to get instant analysis",
            "Ask for help with math problems or coding",
            "Request study tips for better learning"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        window.aiAssistant.addMessage('bot', `💡 Tip: ${randomSuggestion}`);
    }, 3000);
});

// Add CSS for better UX
const style = document.createElement('style');
style.textContent = `
    .chat-input-wrapper:focus-within {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        border-radius: 12px;
    }
    
    .message-text code {
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
    }
    
    .message-text pre {
        background: rgba(0, 0, 0, 0.05);
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 8px 0;
    }
    
    .message-text pre code {
        background: none;
        padding: 0;
    }
`;
document.head.appendChild(style);
