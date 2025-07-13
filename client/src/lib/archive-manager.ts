/**
 * Monthly Archive Manager for BlueFlow
 * Handles saving current month expenses and retrieving archived data
 * Float-compatible for easy migration to Float Flow
 */

export interface ArchivedMonth {
  key: string;
  year: number;
  month: number;
  monthName: string;
  totalExpenses: number;
  expenseCount: number;
  categoryBreakdown: Record<string, number>;
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
  }>;
  savedAt: string;
}

export class ArchiveManager {
  /**
   * Save current month's expenses to archive
   * Generates archive key in format: blueflow_archive_YYYY_MM
   */
  static saveCurrentMonth(): ArchivedMonth | null {
    const currentExpenses = localStorage.getItem('blueflow_expenses');
    if (!currentExpenses) {
      return null;
    }

    const expenses = JSON.parse(currentExpenses);
    if (expenses.length === 0) {
      return null;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const archiveKey = `blueflow_archive_${year}_${month.toString().padStart(2, '0')}`;
    
    // Calculate totals and category breakdown
    const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    const categoryBreakdown: Record<string, number> = {};
    
    expenses.forEach((expense: any) => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    // Create archive object
    const archivedMonth: ArchivedMonth = {
      key: archiveKey,
      year,
      month,
      monthName: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalExpenses,
      expenseCount: expenses.length,
      categoryBreakdown,
      expenses,
      savedAt: now.toISOString()
    };

    // Save to localStorage
    localStorage.setItem(archiveKey, JSON.stringify(archivedMonth));
    
    // Clear current expenses (start fresh month)
    localStorage.removeItem('blueflow_expenses');
    
    return archivedMonth;
  }

  /**
   * Get all archived months from localStorage
   * Returns array sorted by date (newest first)
   */
  static getArchivedMonths(): ArchivedMonth[] {
    const archives: ArchivedMonth[] = [];
    
    // Scan localStorage for archive keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('blueflow_archive_')) {
        const archiveData = localStorage.getItem(key);
        if (archiveData) {
          try {
            const archive = JSON.parse(archiveData);
            archives.push(archive);
          } catch (error) {
            console.error(`Failed to parse archive ${key}:`, error);
          }
        }
      }
    }

    // Sort by year and month (newest first)
    return archives.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }

  /**
   * Get specific archived month by key
   */
  static getArchivedMonth(key: string): ArchivedMonth | null {
    const archiveData = localStorage.getItem(key);
    if (!archiveData) return null;

    try {
      return JSON.parse(archiveData);
    } catch (error) {
      console.error(`Failed to parse archive ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete specific archived month
   */
  static deleteArchivedMonth(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to delete archive ${key}:`, error);
      return false;
    }
  }

  /**
   * Get summary statistics for all archives
   */
  static getArchiveSummary() {
    const archives = this.getArchivedMonths();
    
    if (archives.length === 0) {
      return {
        totalArchives: 0,
        totalSpent: 0,
        averageMonthlySpending: 0,
        totalTransactions: 0
      };
    }

    const totalSpent = archives.reduce((sum, archive) => sum + archive.totalExpenses, 0);
    const totalTransactions = archives.reduce((sum, archive) => sum + archive.expenseCount, 0);

    return {
      totalArchives: archives.length,
      totalSpent,
      averageMonthlySpending: totalSpent / archives.length,
      totalTransactions
    };
  }
}