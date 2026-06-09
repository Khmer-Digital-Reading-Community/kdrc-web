import { ref, onMounted } from "vue";
import {
  followUser,
  unfollowUser,
  checkFollowing,
  getFollowerCounts,
} from "../services/followApi";
import { token } from "../services/auth";

export function useFollow(authorId: string) {
  const isFollowing = ref(false);
  const followersCount = ref(0);
  const followingCount = ref(0);
  const loading = ref(false);

  const fetchFollowState = async () => {
    if (!token.value || !authorId) return;
    try {
      const [followRes, countsRes] = await Promise.all([
        checkFollowing(authorId),
        getFollowerCounts(authorId),
      ]);
      isFollowing.value = followRes.isFollowing;
      followersCount.value = countsRes.followersCount;
      followingCount.value = countsRes.followingCount;
    } catch {
      // not authenticated or user not found — ignore
    }
  };

  const toggleFollow = async () => {
    if (!token.value) return;
    loading.value = true;
    try {
      if (isFollowing.value) {
        await unfollowUser(authorId);
        isFollowing.value = false;
        followersCount.value = Math.max(0, followersCount.value - 1);
      } else {
        await followUser(authorId);
        isFollowing.value = true;
        followersCount.value = followersCount.value + 1;
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchFollowState);

  return { isFollowing, followersCount, followingCount, loading, toggleFollow, fetchFollowState };
}
