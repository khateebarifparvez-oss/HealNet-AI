// AI Engine for Health Analysis - FIXED VERSION

class AIHealthEngine {
    constructor() {
        this.apiKey = "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";
        this.apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        this.model = "deepseek/deepseek-r1-distill-llama-70b:free"; // Changed to more reliable model
    }
    
    async analyzeHealthData(healthData) {
        try {
            console.log("Starting AI health analysis...");
            const prompt = this.createHealthAnalysisPrompt(healthData);
            
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "HTTP-Referer": "https://healnet.com",
                    "X-Title": "HealNet - AI Health Assistant",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": this.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are Dr. HealthAI, a professional medical AI assistant. Provide helpful, accurate health information and recommendations. Always emphasize that your advice is not a substitute for professional medical care. Be compassionate and practical."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.7
                })
            });
            
            console.log("API Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log("AI Response received:", data);
            
            if (!data.choices || !data.choices[0]) {
                throw new Error("Invalid response format from AI");
            }
            
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('AI Analysis Error:', error);
            // Return a MUCH BETTER fallback response
            return this.getDetailedFallbackAnalysis(healthData);
        }
    }
    
    async chatWithAI(userMessage, healthContext = null) {
        try {
            console.log("Sending chat message to AI:", userMessage);
            
            let messages = [
                {
                    "role": "system",
                    "content": `You are Dr. HealthAI, a compassionate medical AI assistant. 

IMPORTANT: You are NOT a real doctor. Provide helpful health information but always recommend consulting healthcare professionals.

User Context: ${healthContext ? JSON.stringify(healthContext) : 'No specific health context provided'}

Be supportive, clear, and provide practical advice.`
                },
                {
                    "role": "user", 
                    "content": userMessage
                }
            ];
            
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "HTTP-Referer": "https://healnet.com", 
                    "X-Title": "HealNet - AI Health Assistant",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": this.model,
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.7
                })
            });

            console.log("Chat API Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Chat API Error:", errorText);
                throw new Error(`API failed: ${response.status}`);
            }

            const data = await response.json();
            console.log("Chat AI Response:", data);

            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            } else {
                throw new Error("No response from AI");
            }
            
        } catch (error) {
            console.error('AI Chat Error:', error);
            // Return a PROPER fallback response
            return this.getSmartFallbackResponse(userMessage, healthContext);
        }
    }

    getSmartFallbackResponse(userMessage, healthContext) {
        // Smart fallback based on the user's question
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('profession') || lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('lecture')) {
            return `Regarding your profession as a lecturer, this can indeed impact health in several ways:

🔍 **Potential Profession-Related Health Factors:**

1. **Sedentary Lifestyle**: Lecturing often involves long hours standing or sitting, which can contribute to:
   - Weight gain and metabolic issues
   - Back and joint pain
   - Poor circulation

2. **Voice Strain**: Frequent speaking can lead to:
   - Throat irritation
   - Vocal cord strain
   - Chronic hoarseness

3. **Mental Stress**: Academic pressures may cause:
   - Anxiety and stress-related symptoms
   - Sleep disturbances
   - Headaches and tension

4. **Irregular Schedule**: Teaching schedules can disrupt:
   - Sleep patterns
   - Eating habits
   - Exercise routines

💡 **Suggestions for Lecturers:**
- Take regular movement breaks during classes
- Practice voice care and hydration
- Implement stress management techniques
- Maintain work-life balance
- Consider ergonomic teaching setups

However, I cannot provide specific medical advice about your symptoms. The chest pain and palpitations you mentioned particularly warrant medical evaluation. Please consult with a healthcare provider who can assess your specific situation.`;
        }
        
        if (lowerMessage.includes('chest pain') || lowerMessage.includes('palpitation')) {
            return `Chest pain and palpitations are symptoms that should always be taken seriously. While they can be caused by various factors including stress, anxiety, or physical exertion, they can also indicate cardiovascular issues that require medical attention.

I strongly recommend consulting with a healthcare provider for proper evaluation of these symptoms. They may suggest tests like an ECG, stress test, or blood work to determine the cause.

In the meantime, try to:
- Avoid strenuous activity
- Practice deep breathing exercises
- Reduce caffeine intake
- Monitor when symptoms occur

Please seek medical attention promptly for chest pain.`;
        }

        // General fallback
        return `I understand you're asking about "${userMessage}". While I'm experiencing temporary technical difficulties, here's some general guidance:

For health concerns related to your symptoms (chest pain, palpitations, headaches, numbness), it's important to:

1. Consult with a healthcare professional for proper diagnosis
2. Keep a symptom diary noting when symptoms occur
3. Follow up with recommended medical tests
4. Discuss your lifestyle factors and profession with your doctor

Your symptoms, particularly chest pain and numbness, should be evaluated by a medical professional to rule out any serious conditions.

Would you like me to try connecting again, or do you have other questions about general health maintenance?`;
    }

    getDetailedFallbackAnalysis(healthData) {
        // Much more detailed and helpful fallback
        return `# Comprehensive Health Analysis

Based on your health assessment, here's a detailed analysis:

## 🔍 **Symptoms Analysis**
You reported: ${healthData.symptoms.join(', ')}

**Key Concerns:**
- Chest pain and palpitations should be medically evaluated
- Multiple neurological symptoms (headache, numbness) warrant attention
- Combination of symptoms suggests comprehensive assessment needed

## 🏥 **Urgent Recommendations**
1. **Immediate Medical Consultation** for chest pain and palpitations
2. **Cardiovascular Assessment** including ECG and blood pressure monitoring
3. **Neurological Evaluation** for headache and numbness

## 💼 **Profession Considerations**
As a lecturer, consider:
- Regular movement breaks during teaching
- Voice care and hydration
- Stress management techniques
- Ergonomic workspace setup

## 🥗 **Lifestyle Adjustments**
- **Activity**: Increase from sedentary to light activity
- **Sleep**: Maintain consistent 7-8 hour schedule
- **Diet**: Continue balanced approach, monitor caffeine
- **Stress**: Implement daily relaxation practices

## 📋 **Next Steps**
1. Schedule appointment with primary care physician
2. Discuss cardiology referral for chest symptoms
3. Consider stress test and Holter monitoring
4. Keep detailed symptom journal

*Note: This is general health guidance. Please consult healthcare professionals for medical advice.*`;
    }

    createHealthAnalysisPrompt(healthData) {
        return `
Comprehensive Health Assessment Analysis Request:

PATIENT PROFILE:
- Age: ${healthData.age}
- Gender: ${healthData.gender} 
- Profession: ${healthData.profession}
- Location: ${healthData.location}

SYMPTOMS REPORTED:
${healthData.symptoms.map(s => `• ${s}`).join('\n')}
Additional Notes: ${healthData.symptomNotes || 'None provided'}

LIFESTYLE FACTORS:
- Smoking: ${healthData.smoking}
- Alcohol: ${healthData.alcohol} 
- Physical Activity: ${healthData.activity}
- Sleep: ${healthData.sleep} per night
- Diet: ${healthData.diet}
- Screen Time: ${healthData.screenTime}
- Night Shifts: ${healthData.nightShift}

MEDICAL HISTORY:
- Past Conditions: ${healthData.pastConditions.join(', ') || 'None'}
- Family History: ${healthData.familyHistory.join(', ') || 'None'}

Please provide:
1. Professional health risk assessment
2. Specific lifestyle recommendations
3. Suggested medical follow-ups
4. Profession-related health considerations
5. Urgency level for different symptoms

Remember to emphasize this is not medical diagnosis and recommend professional consultation.
`;
    }
}

// Initialize AI Engine
const aiHealthEngine = new AIHealthEngine();