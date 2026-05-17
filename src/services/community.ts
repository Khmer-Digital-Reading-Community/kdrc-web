import api from './api';

function unwrap<T>(response: any): T {
  const body = response.data;
  if (body.status === 'success') return body.data as T;
  throw new Error(body.data?.message || 'Unknown API error');
}

export async function fetchChallenges() {
  const res = await api.get('/challenges');
  return unwrap<any[]>(res);
}

export async function fetchMyChallenges() {
  const res = await api.get('/challenges/my');
  return unwrap<any[]>(res);
}

export async function joinChallenge(challengeId: string) {
  const res = await api.post(`/challenges/${challengeId}/join`);
  return unwrap<any>(res);
}

export async function updateChallengeProgress(challengeId: string, completedBooks: number) {
  const res = await api.patch(`/challenges/${challengeId}/progress`, { completedBooks });
  return unwrap<any>(res);
}

export async function fetchAchievements() {
  const res = await api.get('/achievements');
  return unwrap<any[]>(res);
}

export async function fetchMyAchievements() {
  const res = await api.get('/achievements/my');
  return unwrap<any[]>(res);
}

export async function fetchMyStats() {
  const res = await api.get('/reading-progress/stats');
  return unwrap<any>(res);
}

export async function fetchLeaderboard(sort: string = 'books') {
  const res = await api.get('/reading-progress/leaderboard', { params: { sort } });
  return unwrap<any[]>(res);
}

export async function fetchMyReadingProgress() {
  const res = await api.get('/reading-progress');
  return unwrap<any[]>(res);
}

export async function createChallenge(dto: any) {
  const res = await api.post('/challenges', dto);
  return unwrap<any>(res);
}

export async function updateChallenge(id: string, dto: any) {
  const res = await api.patch(`/challenges/${id}`, dto);
  return unwrap<any>(res);
}

export async function deleteChallenge(id: string) {
  const res = await api.delete(`/challenges/${id}`);
  return unwrap<any>(res);
}

export async function upsertReadingProgress(bookId: string, percentageCompleted: number, chapterId?: string) {
  const res = await api.post('/reading-progress', { bookId, percentageCompleted, chapterId });
  return unwrap<any>(res);
}

export async function fetchCommunityStats() {
  const res = await api.get('/community/stats');
  return unwrap<{ totalChallenges: number; activeReaders: number; totalBooksRead: number }>(res);
}
