/**
 * Data Reset Manager for BlueFlow
 * Handles resetting app data to initial empty state
 */

export class DataResetManager {
  /**
   * Reset all app data to initial empty state
   * This clears all stored financial data but preserves user authentication
   */
  static resetToInitialState(): void {
    // Clear financial data
    localStorage.removeItem('blueflow_expenses');
    localStorage.removeItem('blueflow_incomes');
    localStorage.removeItem('blueflow_balance');
    localStorage.removeItem('blueflow_budget_amount');
    localStorage.removeItem('blueflow_budget');
    
    // Clear AI assistant data
    localStorage.removeItem('blueflow_ai_suggestions');
    localStorage.removeItem('blueflow_ai_notifications');
    
    // Clear archive data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('blueflow_archive_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear demo data if present
    localStorage.removeItem('blueflow-demo-data-active');
    localStorage.removeItem('blueflow-demo-expenses');
    localStorage.removeItem('blueflow-demo-incomes');
    localStorage.removeItem('blueflow-demo-budget');
    localStorage.removeItem('blueflow-demo-balance');
    
    // Clear session storage except authentication
    sessionStorage.removeItem('blueflow-splash-shown');
    
    console.log('BlueFlow data reset to initial empty state');
  }

  /**
   * Complete app reset including user onboarding status
   * This triggers the onboarding flow for existing users
   */
  static async completeAppReset(updateUserOnboardingStatus?: (isCompleted: boolean) => Promise<void>): Promise<void> {
    // First reset all local data
    this.resetToInitialState();
    
    // Set user as new user to trigger onboarding
    if (updateUserOnboardingStatus) {
      try {
        await updateUserOnboardingStatus(false); // Set as new user
      } catch (error) {
        console.error('Failed to update user onboarding status:', error);
      }
    }
    
    console.log('Complete app reset performed');
  }

  /**
   * Check if user has any personal data
   * Returns true if user has added personal expenses, income, or custom balance
   */
  static hasPersonalData(): boolean {
    const expenses = localStorage.getItem('blueflow_expenses');
    const incomes = localStorage.getItem('blueflow_incomes');
    const balance = localStorage.getItem('blueflow_balance');
    const budget = localStorage.getItem('blueflow_budget_amount');
    
    // Check if user has actual data (not demo data)
    const hasExpenses = expenses && JSON.parse(expenses).length > 0;
    const hasIncomes = incomes && JSON.parse(incomes).length > 0;
    const hasCustomBalance = balance && parseFloat(balance) !== 0;
    const hasCustomBudget = budget && parseFloat(budget) !== 0;
    
    return hasExpenses || hasIncomes || hasCustomBalance || hasCustomBudget;
  }

  /**
   * Initialize fresh user state
   * Sets up default values for a new user
   */
  static initializeFreshState(): void {
    // Set default values
    localStorage.setItem('blueflow_expenses', '[]');
    localStorage.setItem('blueflow_incomes', '[]');
    localStorage.setItem('blueflow_balance', '0');
    localStorage.setItem('blueflow_budget_amount', '0');
    
    console.log('BlueFlow initialized with fresh empty state');
  }
}