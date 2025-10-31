const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'HealNet AI API is running' });
});

// Submit health assessment (for future backend integration)
router.post('/assess', (req, res) => {
    try {
        const userData = req.body;
        
        // Basic validation
        if (!userData.basic || !userData.symptoms) {
            return res.status(400).json({ 
                error: 'Invalid data format. Please provide basic information and symptoms.' 
            });
        }
        
        // In a real implementation, you would process the data here
        // For now, we'll return a success response
        res.json({
            success: true,
            message: 'Assessment received successfully',
            assessmentId: 'HN' + Date.now()
        });
        
    } catch (error) {
        console.error('Error processing assessment:', error);
        res.status(500).json({ 
            error: 'An error occurred while processing your assessment. Please try again.' 
        });
    }
});

module.exports = router;