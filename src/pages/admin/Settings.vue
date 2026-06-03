<template>
  <section class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>Settings</h2>
        <p>Your admin account preferences</p>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading profile…</div>

    <template v-else>
      <div class="admin-card">
        <div class="admin-card-header"><h3>Profile</h3></div>
        <div class="admin-card-body">
          <form class="settings-form" @submit.prevent="saveProfile">
            <div class="admin-form-group">
              <label for="name">Display name</label>
              <input id="name" v-model="form.name" type="text" required />
            </div>
            <div class="admin-form-group">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" disabled />
            </div>
            <div class="admin-form-group">
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="form.bio" rows="3" placeholder="Short bio" />
            </div>
            <button type="submit" class="admin-btn admin-btn-primary" :disabled="saving">
              {{ saving ? 'Saving…' : 'Save profile' }}
            </button>
          </form>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-header"><h3>Display preferences</h3></div>
        <div class="admin-card-body">
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="items">Table page size</label>
              <select id="items" v-model="prefs.itemsPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="tz">Timezone</label>
              <select id="tz" v-model="prefs.timezone">
                <option value="UTC">UTC</option>
                <option value="Asia/Phnom_Penh">Asia/Phnom Penh</option>
                <option value="America/New_York">Eastern US</option>
              </select>
            </div>
          </div>
          <button type="button" class="admin-btn admin-btn-secondary" @click="savePrefs">
            Save preferences
          </button>
        </div>
      </div>
    </template>

    <p v-if="toast" class="admin-toast" :class="{ error: toastError }">{{ toast }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import { updateMyProfile } from '../../services/adminApi';

const loading = ref(true);
const saving = ref(false);
const toast = ref('');
const toastError = ref(false);

const form = ref({ name: '', email: '', bio: '' });
const prefs = ref({ itemsPerPage: '10', timezone: 'UTC' });

const PREFS_KEY = 'kdrc-admin-prefs';

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => { toast.value = ''; }, 3000);
};

onMounted(async () => {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    if (stored) prefs.value = { ...prefs.value, ...JSON.parse(stored) };
    const user = await api.get('/users/me').then((r) => r.data);
    form.value = {
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
    };
  } catch {
    showToast('Could not load profile', true);
  } finally {
    loading.value = false;
  }
});

const saveProfile = async () => {
  saving.value = true;
  try {
    await updateMyProfile({ name: form.value.name, bio: form.value.bio });
    showToast('Profile saved');
  } catch {
    showToast('Save failed', true);
  } finally {
    saving.value = false;
  }
};

const savePrefs = () => {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs.value));
  showToast('Preferences saved');
};
</script>

<style scoped>
.settings-form {
  max-width: 480px;
}
</style>
