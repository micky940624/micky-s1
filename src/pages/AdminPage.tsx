import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Ticket, Settings, UserPlus, Search, Eye, Ban, RefreshCw, Trash2, Edit, Plus, X } from 'lucide-react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import { useUser } from '../context/UserContext';
import { storage } from '../utils/localStorage';

interface AdminUser {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  subscription: {
    type: 'trial' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  registrationDate: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'support' | 'sales';
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  type: 'cancel_subscription' | 'refund' | 'general_support';
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'cancelled';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

const AdminPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState<SupportTicket | null>(null);

  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    role: 'support' as 'support' | 'sales'
  });

  // Check if user is admin
  const isAdmin = user?.email === 'aslam@gmail.com' || user?.isSpecialAccount;

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = () => {
    // Load all users
    const allUsers = storage.getUsersList();
    setUsers(allUsers.map(u => ({
      ...u,
      registrationDate: u.registrationDate || new Date().toISOString()
    })));

    // Load team members
    const savedTeamMembers = storage.getTeamMembers();
    setTeamMembers(savedTeamMembers);

    // Load tickets
    const savedTickets = storage.getTickets();
    setTickets(savedTickets);
  };

  const addTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.email) {
      alert('Please fill all fields');
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      ...newTeamMember,
      createdAt: new Date().toISOString()
    };

    const updatedMembers = [...teamMembers, member];
    setTeamMembers(updatedMembers);
    storage.saveTeamMembers(updatedMembers);
    
    setNewTeamMember({ name: '', email: '', role: 'support' });
    setShowAddTeamMember(false);
    alert('Team member added successfully!');
  };

  const deleteTeamMember = (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      const updatedMembers = teamMembers.filter(m => m.id !== id);
      setTeamMembers(updatedMembers);
      storage.saveTeamMembers(updatedMembers);
    }
  };

  const createTicket = (userId: string, type: 'cancel_subscription' | 'refund') => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-${Date.now()}`,
      customerName: targetUser.fullName,
      customerPhone: targetUser.phone,
      customerEmail: targetUser.email,
      type,
      message: `${type === 'cancel_subscription' ? 'Subscription cancellation' : 'Refund'} request for ${targetUser.businessName}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    const updatedTickets = [...tickets, ticket];
    setTickets(updatedTickets);
    storage.saveTickets(updatedTickets);
    alert(`${type === 'cancel_subscription' ? 'Cancellation' : 'Refund'} ticket created successfully!`);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status, 
            resolvedAt: status === 'resolved' ? new Date().toISOString() : ticket.resolvedAt 
          }
        : ticket
    );
    setTickets(updatedTickets);
    storage.saveTickets(updatedTickets);
  };

  const getStats = () => {
    const totalUsers = users.length;
    const monthlySubscriptions = users.filter(u => u.subscription.type === 'monthly' && u.subscription.isActive).length;
    const yearlySubscriptions = users.filter(u => u.subscription.type === 'yearly' && u.subscription.isActive).length;
    const totalRevenue = users.reduce((sum, u) => {
      if (u.subscription.isActive) {
        return sum + (u.subscription.type === 'monthly' ? 199 : u.subscription.type === 'yearly' ? 1499 : 0);
      }
      return sum;
    }, 0);

    return { totalUsers, monthlySubscriptions, yearlySubscriptions, totalRevenue };
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = getStats();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'team', label: 'Team', icon: UserPlus },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ResponsiveSidebar />
      
      <div className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage users, subscriptions, and support tickets</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-8 px-6 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-green-900">Monthly Subscriptions</h3>
                      <p className="text-3xl font-bold text-green-600">{stats.monthlySubscriptions}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-purple-900">Yearly Subscriptions</h3>
                      <p className="text-3xl font-bold text-purple-600">{stats.yearlySubscriptions}</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-orange-900">Total Revenue</h3>
                      <p className="text-3xl font-bold text-orange-600">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Business</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Subscription</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{user.fullName}</td>
                            <td className="border border-gray-200 px-4 py-2">{user.businessName}</td>
                            <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.subscription.type === 'trial' ? 'bg-orange-100 text-orange-800' :
                                user.subscription.type === 'monthly' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {user.subscription.type}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => createTicket(user.id, 'cancel_subscription')}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Cancel Subscription"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => createTicket(user.id, 'refund')}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Process Refund"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
                    <button
                      onClick={() => setShowAddTeamMember(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Team Member</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-gray-600">{member.email}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              member.role === 'support' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {member.role}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription Cancellation Requests</h2>
                  <div className="space-y-4">
                    {tickets.filter(t => t.type === 'cancel_subscription').map((ticket) => (
                      <div key={ticket.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">#{ticket.ticketNumber}</h3>
                            <p className="text-gray-700">{ticket.customerName} - {ticket.customerEmail}</p>
                            <p className="text-gray-600 text-sm">{ticket.message}</p>
                            <p className="text-gray-500 text-xs">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <select
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refunds Tab */}
              {activeTab === 'refunds' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Refund Requests</h2>
                  <div className="space-y-4">
                    {tickets.filter(t => t.type === 'refund').map((ticket) => (
                      <div key={ticket.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">#{ticket.ticketNumber}</h3>
                            <p className="text-gray-700">{ticket.customerName} - {ticket.customerEmail}</p>
                            <p className="text-gray-600 text-sm">{ticket.message}</p>
                            <p className="text-gray-500 text-xs">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <select
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">All Support Tickets</h2>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">#{ticket.ticketNumber}</h3>
                            <p className="text-gray-700">{ticket.customerName} - {ticket.customerPhone}</p>
                            <p className="text-gray-600 text-sm">{ticket.message}</p>
                            <div className="flex space-x-4 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.type === 'cancel_subscription' ? 'bg-red-100 text-red-800' :
                                ticket.type === 'refund' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {ticket.type.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowTicketDetails(ticket)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <select
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Settings</h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
                    <p className="text-gray-600">Admin settings and system configuration options will be available here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddTeamMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
                <button
                  onClick={() => setShowAddTeamMember(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value as 'support' | 'sales'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="support">Support Team</option>
                    <option value="sales">Sales Team</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddTeamMember(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTeamMember}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{selectedUser.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-gray-900">{selectedUser.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription Type</label>
                  <p className="text-gray-900">{selectedUser.subscription.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                  <p className="text-gray-900">{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    createTicket(selectedUser.id, 'cancel_subscription');
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
                <button
                  onClick={() => {
                    createTicket(selectedUser.id, 'refund');
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Ticket Details</h2>
                <button
                  onClick={() => setShowTicketDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                  <p className="text-gray-900">#{showTicketDetails.ticketNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{showTicketDetails.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{showTicketDetails.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{showTicketDetails.customerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{showTicketDetails.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="text-gray-900">{showTicketDetails.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={showTicketDetails.status}
                    onChange={(e) => {
                      updateTicketStatus(showTicketDetails.id, e.target.value as SupportTicket['status']);
                      setShowTicketDetails({...showTicketDetails, status: e.target.value as SupportTicket['status']});
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;