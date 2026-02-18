// Symptom Checker functionality

class SymptomChecker {
    constructor() {
        this.symptomDatabase = this.initializeSymptomDatabase();
    }
    
    initializeSymptomDatabase() {
        return {
            // General symptoms
            fatigue: {
                name: "Fatigue",
                description: "Persistent tiredness or lack of energy",
                possibleConditions: ["Anemia", "Thyroid issues", "Chronic fatigue syndrome", "Depression", "Sleep disorders"],
                urgency: "medium"
            },
            fever: {
                name: "Fever",
                description: "Elevated body temperature",
                possibleConditions: ["Infection", "Inflammatory conditions", "Viral illness", "Bacterial infection"],
                urgency: "medium"
            },
            
            // Cardiac symptoms
            chest_pain: {
                name: "Chest Pain",
                description: "Pain or discomfort in the chest area",
                possibleConditions: ["Angina", "Heart attack", "Acid reflux", "Anxiety", "Musculoskeletal pain"],
                urgency: "high"
            },
            shortness_breath: {
                name: "Shortness of Breath",
                description: "Difficulty breathing or feeling breathless",
                possibleConditions: ["Asthma", "COPD", "Heart conditions", "Anxiety", "Pulmonary issues"],
                urgency: "high"
            },
            
            // Digestive symptoms
            abdominal_pain: {
                name: "Abdominal Pain",
                description: "Pain in the stomach or abdominal area",
                possibleConditions: ["Gastritis", "Irritable bowel syndrome", "Appendicitis", "Gallstones", "Food intolerance"],
                urgency: "medium"
            },
            nausea: {
                name: "Nausea",
                description: "Feeling of sickness with an inclination to vomit",
                possibleConditions: ["Gastroenteritis", "Food poisoning", "Migraine", "Pregnancy", "Medication side effects"],
                urgency: "medium"
            },
            
            // Neurological symptoms
            headache: {
                name: "Headache",
                description: "Pain in the head or upper neck",
                possibleConditions: ["Tension headache", "Migraine", "Sinusitis", "Dehydration", "Eye strain"],
                urgency: "low"
            },
            dizziness: {
                name: "Dizziness",
                description: "Sensation of spinning or lightheadedness",
                possibleConditions: ["Vertigo", "Low blood pressure", "Inner ear problems", "Dehydration", "Anxiety"],
                urgency: "medium"
            },
            
            // Mental health symptoms
            anxiety: {
                name: "Anxiety",
                description: "Excessive worry, nervousness, or fear",
                possibleConditions: ["Generalized anxiety disorder", "Panic disorder", "Stress-related conditions", "Thyroid issues"],
                urgency: "medium"
            },
            depression: {
                name: "Depression",
                description: "Persistent feelings of sadness and loss of interest",
                possibleConditions: ["Major depressive disorder", "Bipolar disorder", "Seasonal affective disorder", "Hormonal imbalances"],
                urgency: "medium"
            }
        };
    }
    
    analyzeSymptoms(selectedSymptoms, additionalData = {}) {
        const analysis = {
            urgentSymptoms: [],
            possibleConditions: new Set(),
            recommendations: [],
            overallUrgency: "low"
        };
        
        // Analyze each selected symptom
        selectedSymptoms.forEach(symptomKey => {
            const symptom = this.symptomDatabase[symptomKey];
            if (symptom) {
                // Check urgency
                if (symptom.urgency === "high") {
                    analysis.urgentSymptoms.push(symptom.name);
                }
                
                // Add possible conditions
                symptom.possibleConditions.forEach(condition => {
                    analysis.possibleConditions.add(condition);
                });
            }
        });
        
        // Determine overall urgency
        if (analysis.urgentSymptoms.length > 0) {
            analysis.overallUrgency = "high";
        } else if (selectedSymptoms.length >= 3) {
            analysis.overallUrgency = "medium";
        }
        
        // Generate recommendations based on symptoms
        this.generateSymptomSpecificRecommendations(selectedSymptoms, analysis);
        
        // Convert Set to Array
        analysis.possibleConditions = Array.from(analysis.possibleConditions);
        
        return analysis;
    }
    
    generateSymptomSpecificRecommendations(selectedSymptoms, analysis) {
        // Cardiac symptoms
        if (selectedSymptoms.includes('chest_pain') || selectedSymptoms.includes('shortness_breath')) {
            analysis.recommendations.push("Seek immediate medical attention for chest pain or breathing difficulties");
        }
        
        // Multiple neurological symptoms
        const neuroSymptoms = ['headache', 'dizziness', 'numbness', 'vision_changes'];
        const neuroCount = selectedSymptoms.filter(symptom => neuroSymptoms.includes(symptom)).length;
        if (neuroCount >= 2) {
            analysis.recommendations.push("Consider neurological evaluation for multiple neurological symptoms");
        }
        
        // Digestive symptoms
        const digestiveSymptoms = ['abdominal_pain', 'nausea', 'diarrhea', 'constipation', 'blood_stool'];
        const digestiveCount = selectedSymptoms.filter(symptom => digestiveSymptoms.includes(symptom)).length;
        if (digestiveCount >= 2) {
            analysis.recommendations.push("Consult with a gastroenterologist for persistent digestive issues");
        }
        
        // Mental health symptoms
        const mentalHealthSymptoms = ['anxiety', 'depression', 'insomnia', 'mood_swings', 'stress'];
        const mentalHealthCount = selectedSymptoms.filter(symptom => mentalHealthSymptoms.includes(symptom)).length;
        if (mentalHealthCount >= 2) {
            analysis.recommendations.push("Consider mental health support or counseling");
        }
        
        // General recommendation for multiple symptoms
        if (selectedSymptoms.length >= 5) {
            analysis.recommendations.push("Schedule a comprehensive medical evaluation due to multiple symptoms");
        }
    }
    
    getSymptomInfo(symptomKey) {
        return this.symptomDatabase[symptomKey] || null;
    }
}

// Initialize symptom checker
const symptomChecker = new SymptomChecker();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = symptomChecker;
}