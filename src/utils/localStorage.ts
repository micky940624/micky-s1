// Local Storage Management Utility
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  
  private constructor() {}
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // Generic methods
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // User-specific methods
  saveUser(user: any): void {
    this.setItem('invenease_user', user);
    
    // Also save to users list for login
    const users = this.getItem('invenease_users', []);
    const existingIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (existingIndex !== -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    this.setItem('invenease_users', users);
  }

  saveUsersList(users: any[]): void {
    this.setItem('invenease_users', users);
  }

  getUser(): any | null {
    return this.getItem('invenease_user', null);
  }

  getUsersList(): any[] {
    return this.getItem('invenease_users', []);
  }

  // Products methods
  saveProducts(products: any[]): void {
    this.setItem('invenease_products', products);
  }

  getProducts(): any[] {
    return this.getItem('invenease_products', []);
  }

  // Sales methods
  saveSales(sales: any[]): void {
    this.setItem('invenease_sales', sales);
  }

  getSales(): any[] {
    return this.getItem('invenease_sales', []);
  }

  // Cart methods
  saveCart(cart: any[]): void {
    this.setItem('invenease_cart', cart);
  }

  getCart(): any[] {
    return this.getItem('invenease_cart', []);
  }

  clearCart(): void {
    this.removeItem('invenease_cart');
  }

  // Settings methods
  saveSettings(settings: any): void {
    this.setItem('invenease_settings', settings);
  }

  getSettings(): any {
    return this.getItem('invenease_settings', {
      notifications: {
        lowStock: true,
        dailySales: true,
        email: false
      },
      pos: {
        autoSave: true,
        soundEnabled: true,
        receiptPrint: true
      },
      business: {
        currency: 'INR',
        taxRate: 18,
        lowStockThreshold: 10
      }
    });
  }

  // Notifications methods
  saveNotifications(notifications: any[]): void {
    this.setItem('invenease_notifications', notifications);
  }

  getNotifications(): any[] {
    return this.getItem('invenease_notifications', []);
  }

  // Team members methods (for admin)
  saveTeamMembers(members: any[]): void {
    this.setItem('invenease_team_members', members);
  }

  getTeamMembers(): any[] {
    return this.getItem('invenease_team_members', []);
  }

  // Tickets methods (for admin)
  saveTickets(tickets: any[]): void {
    this.setItem('invenease_tickets', tickets);
  }

  getTickets(): any[] {
    return this.getItem('invenease_tickets', []);
  }

  // Auto-renewal methods
  saveAutoRenewal(renewal: any): void {
    this.setItem('invenease_auto_renewal', renewal);
  }

  getAutoRenewal(): any | null {
    return this.getItem('invenease_auto_renewal', null);
  }

  // Backup and restore methods
  exportAllData(): string {
    const data = {
      user: this.getUser(),
      users: this.getUsersList(),
      products: this.getProducts(),
      sales: this.getSales(),
      settings: this.getSettings(),
      notifications: this.getNotifications(),
      teamMembers: this.getTeamMembers(),
      tickets: this.getTickets(),
      autoRenewal: this.getAutoRenewal(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) this.saveUser(data.user);
      if (data.users) this.setItem('invenease_users', data.users);
      if (data.products) this.saveProducts(data.products);
      if (data.sales) this.saveSales(data.sales);
      if (data.settings) this.saveSettings(data.settings);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.teamMembers) this.saveTeamMembers(data.teamMembers);
      if (data.tickets) this.saveTickets(data.tickets);
      if (data.autoRenewal) this.saveAutoRenewal(data.autoRenewal);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear user-specific data (for logout)
  clearUserData(): void {
    this.removeItem('invenease_user');
    this.removeItem('invenease_products');
    this.removeItem('invenease_sales');
    this.removeItem('invenease_cart');
    this.removeItem('invenease_notifications');
    this.removeItem('invenease_auto_renewal');
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    // For aslam@gmail.com account, provide unlimited storage
    const currentUser = this.getUser();
    if (currentUser?.email === 'aslam@gmail.com') {
      return { used: 0, available: Infinity, percentage: 0 };
    }
    
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    const available = 5 * 1024 * 1024; // 5MB typical limit
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }
}

export const storage = LocalStorageManager.getInstance();