// AI Assistant Chat Functionality

class AIAssistant {
    constructor() {
        this.aiEngine = new AIHealthEngine();
        this.isProcessing = false;
        this.chatHistory = [];
        this.initializeChat();
    }
    
    initializeChat() {
        const sendButton = document.getElementById('aiSendButton');
        const userInput = document.getElementById('aiUserInput');
        const messagesContainer = document.getElementById('aiMessages');
        
        if (sendButton && userInput) {
            // Send message on button click
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
            
            // Send message on Enter key
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isProcessing) {
                    this.sendMessage();
                }
            });
            
            // Clear input when it gets focus
            userInput.addEventListener('focus', () => {
                if (userInput.value === 'Ask me anything about your health results...') {
                    userInput.value = '';
                }
            });
            
            // Restore placeholder when input loses focus and is empty
            userInput.addEventListener('blur', () => {
                if (userInput.value === '') {
                    userInput.value = 'Ask me anything about your health results...';
                }
            });
        }
    }
    
    async sendMessage() {
        if (this.isProcessing) return;
        
        const userInput = document.getElementById('aiUserInput');
        const sendButton = document.getElementById('aiSendButton');
        const messagesContainer = document.getElementById('aiMessages');
        
        const message = userInput.value.trim();
        
        // Don't send empty messages or placeholder text
        if (!message || message === 'Ask me anything about your health results...') {
            return;
        }
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Disable input and show loading
        this.setProcessingState(true);
        
        try {
            // Get health context from current assessment
            const healthContext = window.currentHealthData || null;
            
            // Get AI response
            const aiResponse = await this.aiEngine.chatWithAI(message, healthContext);
            
            // Add AI response to chat
            this.addMessage(aiResponse, 'bot');
            
        } catch (error) {
            console.error('Error in AI chat:', error);
            this.addMessage("I apologize, but I'm experiencing technical difficulties. Please try again in a few moments.", 'bot');
        } finally {
            // Re-enable input
            this.setProcessingState(false);
        }
    }
    
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('aiMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({
            sender,
            content,
            timestamp: new Date().toISOString()
        });
    }
    
    setProcessingState(processing) {
        this.isProcessing = processing;
        
        const sendButton = document.getElementById('aiSendButton');
        const userInput = document.getElementById('aiUserInput');
        
        if (sendButton && userInput) {
            if (processing) {
                sendButton.disabled = true;
                sendButton.textContent = 'Sending...';
                userInput.disabled = true;
            } else {
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
                userInput.disabled = false;
                userInput.focus();
            }
        }
    }
    
    // Method to start a new conversation based on health assessment
    startHealthAssessmentChat(healthData) {
        const messagesContainer = document.getElementById('aiMessages');
        
        // Clear existing messages (keep the first welcome message)
        const welcomeMessage = messagesContainer.querySelector('.ai-message.bot');
        messagesContainer.innerHTML = '';
        
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        // Add initial health assessment message
        if (healthData) {
            const assessmentMessage = `
I've analyzed your health assessment. Here's what I understand about your situation:

- Age: ${healthData.age}
- Key Symptoms: ${healthData.symptoms.slice(0, 5).join(', ')}${healthData.symptoms.length > 5 ? '...' : ''}
- Lifestyle: ${healthData.activity} activity level, ${healthData.diet} diet
- Medical History: ${healthData.pastConditions.length > 0 ? healthData.pastConditions.join(', ') : 'None reported'}

I'm here to help answer any questions you have about your health results, provide general wellness information, and discuss healthy lifestyle choices. What would you like to know?
            `.trim();
            
            this.addMessage(assessmentMessage, 'bot');
        }
        
        // Store health data for context
        window.currentHealthData = healthData;
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('aiMessages');
        messagesContainer.innerHTML = `
            <div class="ai-message bot">
                <div class="message-content">
                    Hello! I'm your AI Health Assistant. I'm here to provide health information and answer your questions. Please remember that I'm an AI assistant and not a medical doctor. Always consult with healthcare professionals for medical advice.
                </div>
            </div>
        `;
        
        this.chatHistory = [];
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiAssistant = new AIAssistant();
    
    // Start health-focused chat when results are displayed
    const originalDisplayResults = window.displayResults;
    window.displayResults = function(analysisResult) {
        originalDisplayResults(analysisResult);
        
        // Start AI chat with health context after a short delay
        setTimeout(() => {
            if (window.aiAssistant && analysisResult.formData) {
                window.aiAssistant.startHealthAssessmentChat(analysisResult.formData);
            }
        }, 1000);
    };
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}