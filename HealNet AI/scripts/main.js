// Main JavaScript file for HealNet

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form navigation
    initFormNavigation();
    
    // Initialize AI assistant
    initAIAssistant();
}

function setupEventListeners() {
    // Start diagnosis button
    const startDiagnosisBtn = document.getElementById('startDiagnosisBtn');
    if (startDiagnosisBtn) {
        startDiagnosisBtn.addEventListener('click', function() {
            document.getElementById('diagnosis').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // New assessment button
    const newAssessmentBtn = document.getElementById('newAssessmentBtn');
    if (newAssessmentBtn) {
        newAssessmentBtn.addEventListener('click', function() {
            resetForm();
            document.getElementById('diagnosis').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Form submission
    const healthForm = document.getElementById('healthForm');
    if (healthForm) {
        healthForm.addEventListener('submit', handleFormSubmission);
    }
}

function initFormNavigation() {
    // Next button functionality
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = this.getAttribute('data-next');
            navigateToSection(nextSection);
        });
    });
    
    // Previous button functionality
    const prevButtons = document.querySelectorAll('.prev-btn');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = this.getAttribute('data-prev');
            navigateToSection(prevSection);
        });
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        
        // If navigating to review section, update the summary
        if (sectionId === 'review') {
            updateReviewSummary();
        }
    }
}

function updateReviewSummary() {
    const summaryContainer = document.getElementById('review-summary');
    
    // Get form data
    const formData = new FormData(document.getElementById('healthForm'));
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const location = document.getElementById('location').value;
    const profession = document.getElementById('profession').value;
    
    // Get selected symptoms
    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Get lifestyle data
    const smoking = document.querySelector('input[name="smoking"]:checked')?.value;
    const alcohol = document.querySelector('input[name="alcohol"]:checked')?.value;
    const activity = document.querySelector('input[name="activity"]:checked')?.value;
    const sleep = document.getElementById('sleep').value;
    const diet = document.getElementById('diet').value;
    
    // Create summary HTML
    let summaryHTML = `
        <div class="summary-section">
            <h4>Basic Information</h4>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Profession:</strong> ${profession}</p>
        </div>
        
        <div class="summary-section">
            <h4>Symptoms</h4>
            <p><strong>Selected Symptoms:</strong> ${selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'None selected'}</p>
            <p><strong>Symptom Details:</strong> ${document.getElementById('symptom_notes').value || 'None provided'}</p>
        </div>
        
        <div class="summary-section">
            <h4>Lifestyle</h4>
            <p><strong>Smoking:</strong> ${smoking}</p>
            <p><strong>Alcohol:</strong> ${alcohol}</p>
            <p><strong>Activity Level:</strong> ${activity}</p>
            <p><strong>Sleep:</strong> ${sleep}</p>
            <p><strong>Diet:</strong> ${diet}</p>
        </div>
    `;
    
    summaryContainer.innerHTML = summaryHTML;
}

async function handleFormSubmission(event) {
    event.preventDefault();
    
    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    try {
        // Collect form data
        const formData = collectFormData();
        
        // Analyze health data
        const analysisResult = await analyzeHealthData(formData);
        
        // Display results
        displayResults(analysisResult);
        
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error processing form:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        alert('There was an error processing your request. Please try again.');
    }
}

function collectFormData() {
    const formData = {};
    
    // Basic information
    formData.name = document.getElementById('name').value;
    formData.age = parseInt(document.getElementById('age').value);
    formData.gender = document.getElementById('gender').value;
    formData.location = document.getElementById('location').value;
    formData.profession = document.getElementById('profession').value;
    
    // Symptoms
    formData.symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);
    formData.symptomNotes = document.getElementById('symptom_notes').value;
    
    // Lifestyle
    formData.smoking = document.querySelector('input[name="smoking"]:checked')?.value;
    formData.alcohol = document.querySelector('input[name="alcohol"]:checked')?.value;
    formData.activity = document.querySelector('input[name="activity"]:checked')?.value;
    formData.sleep = document.getElementById('sleep').value;
    formData.nightShift = document.querySelector('input[name="night_shift"]:checked')?.value;
    formData.screenTime = document.getElementById('screen_time').value;
    formData.diet = document.getElementById('diet').value;
    
    // Medical history
    formData.pastConditions = Array.from(document.querySelectorAll('input[name="past_conditions"]:checked'))
        .map(checkbox => checkbox.value);
    formData.pastConditionDetails = document.getElementById('past_condition_details').value;
    formData.familyHistory = Array.from(document.querySelectorAll('input[name="family_history"]:checked'))
        .map(checkbox => checkbox.value);
    formData.familyHistoryDetails = document.getElementById('family_history_details').value;
    
    // Additional notes
    formData.additionalNotes = document.getElementById('additional_notes').value;
    
    return formData;
}

async function analyzeHealthData(formData) {
    // This function analyzes the health data and returns results
    // In a real application, this would involve more complex analysis
    
    const riskLevel = calculateRiskLevel(formData);
    const potentialConditions = identifyPotentialConditions(formData);
    const recommendations = generateRecommendations(formData);
    const nextSteps = generateNextSteps(formData);
    
    return {
        riskLevel,
        potentialConditions,
        recommendations,
        nextSteps,
        formData
    };
}

function calculateRiskLevel(formData) {
    let riskScore = 0;
    
    // Age factor
    if (formData.age > 60) riskScore += 3;
    else if (formData.age > 45) riskScore += 2;
    else if (formData.age > 30) riskScore += 1;
    
    // Symptoms factor
    riskScore += Math.min(formData.symptoms.length * 0.5, 5);
    
    // Lifestyle factors
    if (formData.smoking === 'current') riskScore += 3;
    if (formData.smoking === 'former') riskScore += 1;
    
    if (formData.alcohol === 'regular') riskScore += 2;
    
    if (formData.activity === 'sedentary') riskScore += 2;
    
    if (formData.sleep === 'less5') riskScore += 2;
    
    if (formData.diet === 'junk_food') riskScore += 2;
    
    // Medical history factors
    riskScore += formData.pastConditions.length;
    riskScore += Math.min(formData.familyHistory.length * 0.5, 3);
    
    // Determine risk level
    if (riskScore >= 10) return { level: 'high', score: riskScore };
    if (riskScore >= 5) return { level: 'medium', score: riskScore };
    return { level: 'low', score: riskScore };
}

function identifyPotentialConditions(formData) {
    const conditions = [];
    
    // Basic condition identification based on symptoms and risk factors
    if (formData.symptoms.includes('chest_pain') || formData.symptoms.includes('shortness_breath')) {
        conditions.push('Cardiovascular issues');
    }
    
    if (formData.symptoms.includes('fatigue') && formData.symptoms.includes('weight_gain')) {
        conditions.push('Thyroid dysfunction');
    }
    
    if (formData.symptoms.includes('frequent_infections') && formData.symptoms.includes('fatigue')) {
        conditions.push('Immune system concerns');
    }
    
    if (formData.symptoms.includes('anxiety') || formData.symptoms.includes('depression')) {
        conditions.push('Mental health considerations');
    }
    
    if (formData.symptoms.includes('abdominal_pain') || formData.symptoms.includes('nausea')) {
        conditions.push('Gastrointestinal issues');
    }
    
    if (formData.symptoms.includes('headache') || formData.symptoms.includes('dizziness')) {
        conditions.push('Neurological considerations');
    }
    
    // If no specific conditions identified, provide general assessment
    if (conditions.length === 0) {
        conditions.push('General health assessment needed');
    }
    
    return conditions;
}

function generateRecommendations(formData) {
    const recommendations = [];
    
    // General recommendations based on risk factors
    if (formData.activity === 'sedentary') {
        recommendations.push('Increase physical activity to at least 150 minutes per week of moderate exercise');
    }
    
    if (formData.diet === 'junk_food') {
        recommendations.push('Adopt a balanced diet rich in fruits, vegetables, and whole grains');
    }
    
    if (formData.sleep === 'less5') {
        recommendations.push('Aim for 7-8 hours of quality sleep per night');
    }
    
    if (formData.smoking === 'current') {
        recommendations.push('Consider smoking cessation programs and resources');
    }
    
    if (formData.screenTime === 'more8') {
        recommendations.push('Take regular breaks from screens and practice the 20-20-20 rule');
    }
    
    // Symptom-specific recommendations
    if (formData.symptoms.includes('stress') || formData.symptoms.includes('anxiety')) {
        recommendations.push('Practice stress management techniques like meditation or yoga');
    }
    
    if (formData.symptoms.length > 3) {
        recommendations.push('Schedule a comprehensive health check-up with your primary care physician');
    }
    
    // Always include these general recommendations
    recommendations.push('Stay hydrated by drinking adequate water throughout the day');
    recommendations.push('Maintain regular health check-ups and screenings appropriate for your age and gender');
    
    return recommendations;
}

function generateNextSteps(formData) {
    const nextSteps = [];
    
    const riskLevel = calculateRiskLevel(formData).level;
    
    if (riskLevel === 'high') {
        nextSteps.push('Schedule an appointment with your healthcare provider within the next week');
        nextSteps.push('Consider consulting with relevant specialists based on your symptoms');
    } else if (riskLevel === 'medium') {
        nextSteps.push('Schedule a routine check-up with your primary care physician within the next month');
        nextSteps.push('Monitor your symptoms and seek medical attention if they worsen');
    } else {
        nextSteps.push('Continue with regular preventive care and annual check-ups');
        nextSteps.push('Maintain your healthy lifestyle habits');
    }
    
    nextSteps.push('Keep a health journal to track any changes in your symptoms');
    nextSteps.push('Follow up with recommended screenings and tests');
    
    return nextSteps;
}

function displayResults(analysisResult) {
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Display risk level
    const riskLevelElement = document.getElementById('riskLevel');
    riskLevelElement.className = `risk-level ${analysisResult.riskLevel.level}`;
    
    let riskMessage = '';
    switch (analysisResult.riskLevel.level) {
        case 'low':
            riskMessage = `
                <h3>Low Health Risk</h3>
                <p>Your current health profile indicates a low overall risk level. Continue maintaining your healthy habits and regular check-ups.</p>
            `;
            break;
        case 'medium':
            riskMessage = `
                <h3>Medium Health Risk</h3>
                <p>Your health profile shows some areas that need attention. Consider implementing the recommendations below and consult with your healthcare provider.</p>
            `;
            break;
        case 'high':
            riskMessage = `
                <h3>High Health Risk</h3>
                <p>Your health profile indicates several risk factors that require attention. We recommend consulting with healthcare professionals promptly.</p>
            `;
            break;
    }
    
    riskLevelElement.innerHTML = riskMessage;
    
    // Display potential conditions
    const conditionsElement = document.getElementById('potentialConditions');
    conditionsElement.innerHTML = `
        <h3>Potential Health Considerations</h3>
        <ul>
            ${analysisResult.potentialConditions.map(condition => `<li>${condition}</li>`).join('')}
        </ul>
    `;
    
    // Display recommendations
    const recommendationsElement = document.getElementById('recommendations');
    recommendationsElement.innerHTML = `
        <h3>Health Recommendations</h3>
        <ul>
            ${analysisResult.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;
    
    // Display next steps
    const nextStepsElement = document.getElementById('nextStepsList');
    nextStepsElement.innerHTML = analysisResult.nextSteps.map(step => `<li>${step}</li>`).join('');
    
    // Store form data for AI assistant
    window.currentHealthData = analysisResult.formData;
}

function resetForm() {
    // Reset form
    document.getElementById('healthForm').reset();
    
    // Hide results section
    document.getElementById('results').style.display = 'none';
    
    // Navigate to first section
    navigateToSection('basic-info');
    
    // Clear AI messages
    const aiMessages = document.getElementById('aiMessages');
    if (aiMessages) {
        aiMessages.innerHTML = `
            <div class="ai-message bot">
                <div class="message-content">
                    Hello! I'm your AI Health Assistant. I've analyzed your health assessment and I'm here to provide personalized health recommendations and answer any questions you might have about your results.
                </div>
            </div>
        `;
    }
}

function initAIAssistant() {
    // AI assistant initialization is handled in ai-assistant.js
    // This function is a placeholder for future enhancements
}