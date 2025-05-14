const FinancialReportService = require('../services/FinancialReportService');

class FinancialReportProxy {
  constructor(user) {
    this.user = user;
    this.financialReportService = new FinancialReportService();
  }

  generateReport() {
    if (this.user && this.user.role === 'Admin') {
      console.log("Admin accessing financial report.");
      return this.financialReportService.generateReport();
    } else {
      console.log("Non-admin user attempted to access financial report.");
      throw new Error('Unauthorized access to financial reports.');
    }
  }
}

module.exports = FinancialReportProxy;