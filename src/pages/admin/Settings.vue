<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>Settings</h2>
        <p>Manage your account, security, and system preferences</p>
      </div>
    </div>

    <!-- Settings Container -->
    <div class="settings-container">
      <!-- Profile Settings Section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h3>Profile Information</h3>
            <p>Update your account details and profile picture</p>
          </div>
        </div>
        <div class="card-content">
          <div class="profile-section">
            <div class="avatar-upload">
              <div class="avatar-preview">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Profile" />
              </div>
              <div class="upload-controls">
                <button class="btn btn-secondary">Upload Photo</button>
                <p class="info-text">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="first-name">First Name</label>
              <input 
                id="first-name"
                v-model="settings.firstName" 
                type="text" 
                placeholder="Enter first name"
              />
            </div>

            <div class="form-group">
              <label for="last-name">Last Name</label>
              <input 
                id="last-name"
                v-model="settings.lastName" 
                type="text" 
                placeholder="Enter last name"
              />
            </div>

            <div class="form-group full-width">
              <label for="email">Email Address</label>
              <input 
                id="email"
                v-model="settings.email" 
                type="email" 
                placeholder="Enter email address"
              />
            </div>

            <div class="form-group full-width">
              <label for="phone">Phone Number</label>
              <input 
                id="phone"
                v-model="settings.phone" 
                type="tel" 
                placeholder="Enter phone number"
              />
            </div>

            <div class="form-group full-width">
              <label for="bio">Bio</label>
              <textarea 
                id="bio"
                v-model="settings.bio" 
                placeholder="Write a short bio about yourself"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary" @click="saveProfile">Save Profile</button>
          </div>
        </div>
      </div>

      <!-- Security Settings Section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h3>Security Settings</h3>
            <p>Manage your password and security preferences</p>
          </div>
        </div>
        <div class="card-content">
          <!-- Change Password -->
          <div class="security-section">
            <div class="section-title">
              <h4>Change Password</h4>
              <p>Update your password regularly to keep your account secure</p>
            </div>
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input 
                id="current-password"
                v-model="passwordForm.current" 
                type="password" 
                placeholder="Enter current password"
              />
            </div>

            <div class="form-group">
              <label for="new-password">New Password</label>
              <input 
                id="new-password"
                v-model="passwordForm.new" 
                type="password" 
                placeholder="Enter new password"
              />
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input 
                id="confirm-password"
                v-model="passwordForm.confirm" 
                type="password" 
                placeholder="Confirm new password"
              />
            </div>

            <button class="btn btn-secondary" @click="changePassword">Update Password</button>
          </div>

          <div class="divider"></div>

          <!-- Two-Factor Authentication -->
          <div class="security-section">
            <div class="section-title">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div class="twofa-status">
              <div class="status-info">
                <span class="status-badge" :class="settings.twoFactorEnabled ? 'enabled' : 'disabled'">
                  {{ settings.twoFactorEnabled ? '✓ Enabled' : 'Not Enabled' }}
                </span>
              </div>
              <button 
                :class="settings.twoFactorEnabled ? 'btn btn-danger' : 'btn btn-secondary'"
                @click="toggleTwoFactor"
              >
                {{ settings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
              </button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Active Sessions -->
          <div class="security-section">
            <div class="section-title">
              <h4>Active Sessions</h4>
              <p>Manage your active login sessions</p>
            </div>
            <div class="sessions-list">
              <div v-for="session in activeSessions" :key="session.id" class="session-item">
                <div class="session-info">
                  <p class="device-name">{{ session.device }}</p>
                  <p class="session-meta">{{ session.location }} • {{ session.lastActive }}</p>
                </div>
                <button class="btn btn-sm btn-secondary" @click="logoutSession(session.id)">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings Section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h3>Notification Preferences</h3>
            <p>Control how and when you receive notifications</p>
          </div>
        </div>
        <div class="card-content">
          <div class="notification-options">
            <div v-for="notification in notificationSettings" :key="notification.id" class="notification-item">
              <div class="notification-info">
                <h4>{{ notification.label }}</h4>
                <p>{{ notification.description }}</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  v-model="notification.enabled"
                  :id="`notif-${notification.id}`"
                  class="checkbox"
                />
                <label :for="`notif-${notification.id}`"></label>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary" @click="saveNotifications">Save Preferences</button>
          </div>
        </div>
      </div>

      <!-- System Settings Section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h3>System Settings</h3>
            <p>Configure your application experience</p>
          </div>
        </div>
        <div class="card-content">
          <div class="form-grid">
            <div class="form-group">
              <label for="theme">Theme</label>
              <select id="theme" v-model="settings.theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div class="form-group">
              <label for="language">Language</label>
              <select id="language" v-model="settings.language">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div class="form-group">
              <label for="timezone">Timezone</label>
              <select id="timezone" v-model="settings.timezone">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="CST">Central Time</option>
                <option value="MST">Mountain Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>

            <div class="form-group">
              <label for="items-per-page">Items Per Page</label>
              <select id="items-per-page" v-model="settings.itemsPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary" @click="saveSystemSettings">Save Settings</button>
          </div>
        </div>
      </div>

      <!-- Danger Zone Section -->
      <div class="settings-card danger-zone">
        <div class="card-header">
          <div>
            <h3>Danger Zone</h3>
            <p>Irreversible actions - proceed with caution</p>
          </div>
        </div>
        <div class="card-content">
          <div class="danger-action">
            <div class="danger-info">
              <h4>Download Your Data</h4>
              <p>Export all your account data and settings</p>
            </div>
            <button class="btn btn-secondary">Download</button>
          </div>

          <div class="divider"></div>

          <div class="danger-action">
            <div class="danger-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button class="btn btn-danger" @click="deleteAccount">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Session {
  id: number;
  device: string;
  location: string;
  lastActive: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const settings = ref({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@kdrc.org',
  phone: '+1 (555) 000-0000',
  bio: 'Administrator managing the KDRC platform',
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  itemsPerPage: '10',
  twoFactorEnabled: false,
});

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
});

const activeSessions = ref<Session[]>([
  { id: 1, device: 'Chrome on Windows', location: 'New York, NY', lastActive: 'Just now' },
  { id: 2, device: 'Safari on macOS', location: 'San Francisco, CA', lastActive: '2 hours ago' },
]);

const notificationSettings = ref<NotificationSetting[]>([
  {
    id: 'user-activity',
    label: 'User Activity',
    description: 'Get notified about new user registrations and activities',
    enabled: true,
  },
  {
    id: 'comments',
    label: 'Comments & Reports',
    description: 'Receive alerts for new comments and user reports',
    enabled: true,
  },
  {
    id: 'system',
    label: 'System Updates',
    description: 'Notifications about system updates and maintenance',
    enabled: false,
  },
  {
    id: 'security',
    label: 'Security Alerts',
    description: 'Critical security and account alerts',
    enabled: true,
  },
  {
    id: 'email',
    label: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true,
  },
]);

const saveProfile = () => {
  alert('Profile updated successfully!');
};

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Passwords do not match!');
    return;
  }
  if (passwordForm.value.new.length < 8) {
    alert('Password must be at least 8 characters!');
    return;
  }
  alert('Password changed successfully!');
  passwordForm.value = { current: '', new: '', confirm: '' };
};

const toggleTwoFactor = () => {
  settings.value.twoFactorEnabled = !settings.value.twoFactorEnabled;
  alert(settings.value.twoFactorEnabled ? '2FA enabled successfully!' : '2FA disabled successfully!');
};

const logoutSession = (sessionId: number) => {
  activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId);
  alert('Session logged out successfully!');
};

const saveNotifications = () => {
  alert('Notification preferences saved!');
};

const saveSystemSettings = () => {
  alert('System settings saved!');
};

const deleteAccount = () => {
  if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
    alert('Account deletion initiated. You will receive a confirmation email.');
  }
};
</script>

<style scoped>
.admin-page {
  gap: 24px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 4px;
}

.page-header p {
  color: #8a9f8f;
  margin: 0;
  font-size: 0.95rem;
}

/* Settings Container */
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Settings Card */
.settings-card {
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  overflow: hidden;
}

.settings-card.danger-zone {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.02);
}

.settings-card.danger-zone .card-header {
  border-bottom-color: rgba(231, 76, 60, 0.2);
}

.settings-card.danger-zone h3 {
  color: #e74c3c;
}

/* Card Header */
.card-header {
  padding: 24px;
  border-bottom: 1px solid #e0e4e0;
  background: #f8f9f7;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
}

.card-header p {
  color: #8a9f8f;
  margin: 0;
  font-size: 0.9rem;
}

/* Card Content */
.card-content {
  padding: 24px;
}

/* Card Footer */
.card-footer {
  padding: 24px;
  border-top: 1px solid #e0e4e0;
  background: #f8f9f7;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: #1f2d20;
  color: white;
}

.btn-primary:hover {
  background: #162310;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #e0e4e0;
}

.btn-secondary:hover {
  background: #e0e4e0;
}

.btn-danger {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.btn-danger:hover {
  background: rgba(231, 76, 60, 0.2);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Form Elements */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-grid .form-group.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #1f2d20;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1f2d20;
  background: #ffffff;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1f2d20;
  box-shadow: 0 0 0 3px rgba(31, 45, 32, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.info-text {
  font-size: 0.85rem;
  color: #8a9f8f;
  margin: 0;
}

/* Profile Section */
.profile-section {
  margin-bottom: 24px;
}

.avatar-upload {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #e0e4e0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9f7;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Security Sections */
.security-section {
  margin-bottom: 24px;
}

.security-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin-bottom: 16px;
}

.section-title h4 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
}

.section-title p {
  color: #8a9f8f;
  margin: 0;
  font-size: 0.9rem;
}

/* Divider */
.divider {
  height: 1px;
  background: #e0e4e0;
  margin: 24px 0;
}

/* Two-Factor Authentication */
.twofa-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9f7;
  border-radius: 8px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.enabled {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.status-badge.disabled {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9f7;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
}

.session-info {
  flex: 1;
}

.device-name {
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
}

.session-meta {
  font-size: 0.85rem;
  color: #8a9f8f;
  margin: 0;
}

/* Notification Options */
.notification-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9f7;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
}

.notification-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
}

.notification-info p {
  font-size: 0.85rem;
  color: #8a9f8f;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-switch label {
  display: inline-flex;
  width: 48px;
  height: 26px;
  background: #e0e4e0;
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-switch label::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch input[type="checkbox"]:checked + label {
  background: #1f2d20;
}

.toggle-switch input[type="checkbox"]:checked + label::after {
  left: 24px;
}

/* Danger Actions */
.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.danger-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
}

.danger-info p {
  font-size: 0.85rem;
  color: #8a9f8f;
  margin: 0;
}

/* Checkbox */
.checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #1f2d20;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .avatar-upload {
    flex-direction: column;
    align-items: center;
  }

  .twofa-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .danger-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .card-footer {
    flex-direction: column;
  }

  .card-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>