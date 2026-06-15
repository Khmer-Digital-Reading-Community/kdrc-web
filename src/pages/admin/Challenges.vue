<template>
  <section class="admin-page">
    <div class="page-header">
      <!-- <div>
        <h2>Challenge Management</h2>
        <p>Create and manage community reading challenges</p>
      </div> -->
      <button class="btn btn-primary" @click="openAdd">
        <span>+</span>
        Add Challenge
      </button>
    </div>

    <div v-if="loading" class="loading-state">Loading challenges...</div>

    <div v-else class="table-container">
      <table class="challenges-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Description</th>
            <th>Target</th>
            <th>Deadline</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in challenges" :key="c.id" class="challenge-row">
            <td>
              <div
                class="challenge-icon"
                :style="{ background: c.color }"
                v-html="c.icon"
              ></div>
            </td>
            <td class="challenge-title">
              <strong>{{ c.title }}</strong>
            </td>
            <td class="challenge-desc">{{ c.description }}</td>
            <td>{{ c.targetBooks }} books</td>
            <td>
              {{
                c.deadline
                  ? new Date(c.deadline).toLocaleDateString()
                  : "No deadline"
              }}
            </td>
            <td>
              <span class="color-dot" :style="{ background: c.color }"></span>
            </td>
            <td>
              <div class="actions">
                <button
                  class="action-btn users"
                  title="Participants"
                  @click="openParticipants(c)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </button>
                <button
                  class="action-btn edit"
                  title="Edit"
                  @click="openEdit(c)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </button>
                <button
                  class="action-btn delete"
                  title="Delete"
                  @click="confirmDelete(c)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!challenges.length">
            <td colspan="7" class="empty-state">
              No challenges yet. Click "Add Challenge" to create one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editing ? "Edit Challenge" : "Add Challenge" }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="e.g. 2025 Reading Challenge"
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="form.description"
              class="form-input"
              rows="3"
              placeholder="Describe the challenge"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Target Books</label>
              <input
                v-model.number="form.targetBooks"
                type="number"
                min="1"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Deadline (optional)</label>
              <input v-model="form.deadline" type="date" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Color</label>
              <div class="color-picker">
                <button
                  v-for="c in presetColors"
                  :key="c"
                  class="color-swatch"
                  :class="{ selected: form.color === c }"
                  :style="{ background: c }"
                  @click="form.color = c"
                ></button>
                <input
                  v-model="form.color"
                  type="text"
                  class="form-input color-input"
                  placeholder="#hex"
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Icon</label>
            <div class="icon-picker">
              <button
                v-for="ic in presetIcons"
                :key="ic.id"
                class="icon-option"
                :class="{ selected: form.icon === ic.svg }"
                :title="ic.label"
                @click="form.icon = ic.svg"
                v-html="ic.svg"
              ></button>
            </div>
            <details class="custom-icon-details">
              <summary class="custom-icon-summary">Or paste custom SVG</summary>
              <textarea
                v-model="form.icon"
                class="form-input form-input-mono"
                rows="3"
                placeholder="<svg ...>...</svg>"
              ></textarea>
            </details>
            <div v-if="form.icon" class="icon-preview" v-html="form.icon"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="save" :disabled="saving">
            {{ saving ? "Saving..." : editing ? "Update" : "Create" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDelete"
      class="modal-overlay"
      @click.self="showDelete = false"
    >
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>Delete Challenge</h3>
          <button class="modal-close" @click="showDelete = false">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete
            <strong>{{ deleting?.title }}</strong
            >?
          </p>
          <p class="text-muted">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDelete = false">
            Cancel
          </button>
          <button class="btn btn-danger" @click="remove" :disabled="saving">
            {{ saving ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ───── PARTICIPANTS MODAL ───── -->
    <div
      v-if="showParticipants"
      class="modal-overlay"
      @click.self="closeParticipants"
    >
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Participants: {{ selectedChallenge?.title }}</h3>
          <button class="modal-close" @click="closeParticipants">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div v-if="participantsLoading" class="loading-state">
            Loading participants...
          </div>
          <div v-else-if="participantsError" class="empty-state">
            {{ participantsError }}
          </div>
          <div v-else-if="!participants.length" class="empty-state">
            No one has joined this challenge yet.
          </div>
          <table v-else class="participants-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Progress</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in participants" :key="p.id">
                <td class="participant-user">
                  <div
                    class="participant-avatar"
                    :style="{ background: avatarColor(p.name) }"
                  >
                    {{ initials(p.name) }}
                  </div>
                  <span>{{ p.name }}</span>
                </td>
                <td>{{ p.email }}</td>
                <td>
                  {{ p.completedBooks }} /
                  {{ selectedChallenge?.targetBooks }} books
                </td>
                <td>{{ formatDate(p.joinedAt) }}</td>
                <td>
                  <span class="participant-badge" :class="statusClass(p)">
                    {{ statusLabel(p) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeParticipants">
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  fetchChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  fetchChallengeParticipants,
} from "../../services/community";

export default {
  name: "AdminChallenges",
  data() {
    return {
      challenges: [],
      loading: true,
      showModal: false,
      showDelete: false,
      editing: null,
      deleting: null,
      saving: false,
      showParticipants: false,
      selectedChallenge: null,
      participants: [],
      participantsLoading: false,
      participantsError: null,
      form: this.emptyForm(),
      presetColors: [
        "#1c3a2e",
        "#7a3d92",
        "#3a5fa5",
        "#c5a050",
        "#0f6e56",
        "#a04040",
        "#2d6b5e",
        "#d4a574",
        "#4a7c6f",
        "#8b5cf6",
      ],
      presetIcons: [
        {
          id: "book",
          label: "Book",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
        },
        {
          id: "star",
          label: "Star",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        },
        {
          id: "trophy",
          label: "Trophy",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>',
        },
        {
          id: "target",
          label: "Target",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        },
        {
          id: "pen",
          label: "Write",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
        },
        {
          id: "stack",
          label: "Books",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
        },
        {
          id: "medal",
          label: "Medal",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M12 13l-2.5 6 2.5-1 2.5 1-2.5-6z"/></svg>',
        },
        {
          id: "fire",
          label: "Streak",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 3.5L17 7l-3.5 1.5L12 12l-1.5-3.5L7 7l3.5-1.5L12 2z"/><path d="M12 12l1.5 3.5L17 17l-3.5 1.5L12 22l-1.5-3.5L7 17l3.5-1.5L12 12z"/></svg>',
        },
        {
          id: "heart",
          label: "Heart",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
        },
        {
          id: "crown",
          label: "Crown",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg>',
        },
        {
          id: "sparkles",
          label: "Special",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 15l1.5 3L10 19l-3.5 1L5 23l-1.5-3L0 19l3.5-1L5 15z"/><path d="M19 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>',
        },
        {
          id: "compass",
          label: "Explore",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
        },
        {
          id: "clock",
          label: "Timed",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        },
        {
          id: "users",
          label: "Community",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
        },
        {
          id: "leaf",
          label: "Nature",
          svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
        },
      ],
    };
  },
  created() {
    this.load();
  },
  methods: {
    async openParticipants(c) {
      this.selectedChallenge = c;
      this.showParticipants = true;
      this.participantsLoading = true;
      this.participantsError = null;
      try {
        this.participants = await fetchChallengeParticipants(c.id);
      } catch (e) {
        this.participantsError = e.message || "Failed to load participants";
        this.participants = [];
      }
      this.participantsLoading = false;
    },
    closeParticipants() {
      this.showParticipants = false;
      this.selectedChallenge = null;
      this.participants = [];
      this.participantsError = null;
    },
    initials(name) {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },
    avatarColor(name) {
      const colors = [
        "#3d6b4f",
        "#7a3d92",
        "#3a5fa5",
        "#c8861a",
        "#a04040",
        "#2d6b5e",
        "#d4a574",
        "#5a9f72",
      ];
      let hash = 0;
      for (let i = 0; i < (name || "").length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    },
    formatDate(d) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    statusClass(p) {
      if (p.expired) return "danger";
      if (p.completedAt) return "success";
      return "neutral";
    },
    statusLabel(p) {
      if (p.expired) return "Expired";
      if (p.completedAt) return "Completed";
      return "In Progress";
    },
    emptyForm() {
      return {
        title: "",
        description: "",
        targetBooks: 10,
        deadline: "",
        color: "#1c3a2e",
        icon: "",
      };
    },
    async load() {
      this.loading = true;
      try {
        this.challenges = await fetchChallenges();
      } catch (e) {
        this.challenges = [];
      }
      this.loading = false;
    },
    openAdd() {
      this.editing = null;
      this.form = this.emptyForm();
      this.showModal = true;
    },
    openEdit(c) {
      this.editing = c;
      this.form = {
        title: c.title,
        description: c.description,
        targetBooks: c.targetBooks,
        deadline: c.deadline ? c.deadline.slice(0, 10) : "",
        color: c.color,
        icon: c.icon,
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editing = null;
    },
    async save() {
      this.saving = true;
      try {
        const payload = { ...this.form };
        if (!payload.deadline) delete payload.deadline;
        if (this.editing) {
          await updateChallenge(this.editing.id, payload);
        } else {
          await createChallenge(payload);
        }
        this.closeModal();
        await this.load();
      } catch (e) {
        alert(e.message || "Failed to save challenge");
      }
      this.saving = false;
    },
    confirmDelete(c) {
      this.deleting = c;
      this.showDelete = true;
    },
    async remove() {
      this.saving = true;
      try {
        await deleteChallenge(this.deleting.id);
        this.showDelete = false;
        this.deleting = null;
        await this.load();
      } catch (e) {
        alert(e.message || "Failed to delete challenge");
      }
      this.saving = false;
    },
  },
};
</script>

<style scoped>
.admin-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 4px;
  font-size: 1.5rem;
  color: var(--admin-text, #1f2d20);
}

.page-header p {
  margin: 0;
  color: var(--admin-muted, #8a9f8f);
  font-size: 0.9rem;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--admin-muted, #8a9f8f);
}

.table-container {
  background: var(--admin-surface, #ffffff);
  border-radius: 8px;
  border: 1px solid var(--admin-border, #e0e4e0);
  overflow-x: auto;
}

.challenges-table {
  width: 100%;
  border-collapse: collapse;
}

.challenges-table th {
  background: var(--admin-table-head, #f8f9f7);
  padding: 12px 16px;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--admin-muted, #8a9f8f);
  border-bottom: 1px solid var(--admin-border, #e0e4e0);
  white-space: nowrap;
}

.challenges-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--admin-table-row-border, #f0f2ee);
  font-size: 0.9rem;
  color: var(--admin-muted, #5a675f);
}

.challenge-row:hover {
  background: var(--admin-table-row-hover, #f8f9f7);
}

.challenge-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.challenge-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.challenge-title {
  color: var(--admin-text, #1f2d20) !important;
  min-width: 140px;
}

.challenge-desc {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.color-dot {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--admin-border, #e0e4e0);
}

.actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.action-btn.users {
  background: var(--admin-accent-soft, #e8f0ea);
  color: var(--admin-accent, #3d6b4f);
}

.action-btn.users:hover {
  background: var(--admin-accent-soft, #d0e4d5);
}

.action-btn.edit {
  background: var(--admin-stat-blue-bg, #e8f0fa);
  color: var(--admin-info, #3b82c4);
}

.action-btn.edit:hover {
  background: var(--admin-badge-info-bg, #d0e4f5);
}

.action-btn.delete {
  background: var(--admin-btn-danger-bg, #fbe9e7);
  color: var(--admin-danger, #c62828);
}

.action-btn.delete:hover {
  background: var(--admin-badge-danger-bg, #ffccbc);
}

.empty-state {
  text-align: center !important;
  padding: 40px 16px !important;
  color: var(--admin-muted, #c0c4c0) !important;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--admin-surface, #ffffff);
  border-radius: 12px;
  width: 520px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-sm {
  width: 400px;
}

.modal-lg {
  width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--admin-text, #1f2d20);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--admin-muted, #8a9f8f);
  cursor: pointer;
  padding: 0 4px;
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 20px;
}

/* Participants table */
.participants-table {
  width: 100%;
  border-collapse: collapse;
}

.participants-table th {
  text-align: left;
  padding: 10px 12px;
  background: var(--admin-table-head, #f8f9f7);
  color: var(--admin-muted, #8a9f8f);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--admin-border, #e0e4e0);
}

.participants-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--admin-table-row-border, #f0f2ee);
  font-size: 0.85rem;
  color: var(--admin-muted, #5a675f);
}

.participants-table tbody tr:hover {
  background: var(--admin-table-row-hover, #f8f9f7);
}

.participant-user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--admin-text, #1f2d20);
  font-weight: 500;
}

.participant-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.participant-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}

.participant-badge.success {
  background: var(--admin-badge-success-bg, #e8f5ec);
  color: var(--admin-badge-success-text, #2d6a4f);
}

.participant-badge.danger {
  background: var(--admin-badge-danger-bg, #fdecec);
  color: var(--admin-danger, #c62828);
}

.participant-badge.neutral {
  background: var(--admin-badge-neutral-bg, #f0f3f1);
  color: var(--admin-badge-neutral-text, #5a6b5e);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-muted, #5a675f);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--admin-border, #e0e4e0);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--admin-text, #1f2d20);
  background: var(--admin-bg, #fafbfa);
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: var(--admin-accent, #1f2d20);
  background: var(--admin-surface, #ffffff);
}

.form-input-mono {
  font-family: monospace;
  font-size: 0.8rem;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.color-swatch:hover {
  transform: scale(1.15);
}

.color-swatch.selected {
  border-color: var(--admin-accent, #1f2d20);
  box-shadow:
    0 0 0 2px var(--admin-surface, white),
    0 0 0 4px var(--admin-accent, #1f2d20);
}

.color-input {
  width: 100px !important;
  flex: none;
  padding: 6px 8px;
  font-family: monospace;
  font-size: 0.8rem;
}

.icon-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.icon-option {
  width: 40px;
  height: 40px;
  border: 2px solid var(--admin-border, #e0e4e0);
  border-radius: 8px;
  background: var(--admin-bg, #fafbfa);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  padding: 0;
  color: var(--admin-muted, #5a675f);
}

.icon-option:hover {
  border-color: var(--admin-accent, #1f2d20);
  background: var(--admin-accent-soft, #f0f2ee);
}

.icon-option.selected {
  border-color: var(--admin-accent, #1f2d20);
  background: var(--admin-badge-success-bg, #e8f5e9);
  color: var(--admin-text, #1f2d20);
  box-shadow:
    0 0 0 2px var(--admin-surface, white),
    0 0 0 4px var(--admin-accent, #1f2d20);
}

.custom-icon-details {
  margin-top: 4px;
}

.custom-icon-summary {
  font-size: 0.8rem;
  color: var(--admin-muted, #8a9f8f);
  cursor: pointer;
  padding: 4px 0;
}

.custom-icon-summary:hover {
  color: var(--admin-text, #1f2d20);
}

.icon-preview {
  margin-top: 8px;
  padding: 12px;
  background: var(--admin-table-row-hover, #f8f9f7);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--admin-border, #e0e4e0);
}

.icon-preview :deep(svg) {
  width: 28px;
  height: 28px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: var(--admin-accent, #1f2d20);
  color: white;
}

.btn-primary:hover {
  background: var(--admin-accent, #2d4030);
  filter: brightness(1.15);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--admin-badge-neutral-bg, #f0f2ee);
  color: var(--admin-muted, #5a675f);
}

.btn-secondary:hover {
  background: var(--admin-border, #e0e4e0);
}

.btn-danger {
  background: var(--admin-danger, #c62828);
  color: white;
}

.btn-danger:hover {
  filter: brightness(1.15);
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-muted {
  color: var(--admin-muted, #8a9f8f);
  font-size: 0.85rem;
}
</style>
