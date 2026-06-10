import api from "./api";

export const followUser = async (followingId: string) => {
  const res = await api.post("/follows", { followingId });
  return res.data;
};

export const unfollowUser = async (followingId: string) => {
  const res = await api.delete(`/follows/${followingId}`);
  return res.data;
};

export const checkFollowing = async (userId: string) => {
  const res = await api.get(`/follows/check/${userId}`);
  return res.data as { isFollowing: boolean };
};

export const getFollowerCounts = async (userId: string) => {
  const res = await api.get(`/follows/user/${userId}/counts`);
  return res.data as { followersCount: number; followingCount: number };
};

export const getFollowers = async (userId: string, page = 1, limit = 20) => {
  const res = await api.get(`/follows/user/${userId}/followers`, {
    params: { page, limit },
  });
  return res.data;
};

export const getFollowing = async (userId: string, page = 1, limit = 20) => {
  const res = await api.get(`/follows/user/${userId}/following`, {
    params: { page, limit },
  });
  return res.data;
};

export const getAuthorProfile = async (userId: string) => {
  const res = await api.get(`/users/profile/${userId}`);
  return res.data;
};
