const express = require('express');
const router = express.Router();
const FinancialReportProxy = require('../proxies/FinancialReportProxy');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware

// Route to get financial reports (Admin only)
router.get('/financial-reports', auth, async (req, res) => {
    try {
        // Assuming user information (including role) is available in req.user after auth middleware
        const user = req.user;
//ntc
        const financialReportProxy = new FinancialReportProxy(user);
        const reports = financialReportProxy.getFinancialReports();

        res.json(reports);

    } catch (error) {
        console.error('Error fetching financial reports:', error);
        // Depending on your proxy implementation, the error message might indicate unauthorized access
        if (error.message === 'Unauthorized access to financial reports') {
            res.status(403).json({ message: 'Unauthorized to access financial reports' });
        } else {
            res.status(500).json({ message: 'Server error fetching financial reports' });
        }
    }
});

module.exports = router;