import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useCloudinaryUpload = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const uploadBookCover = async (file: File) => {
    return uploadFile(file, 'book-cover');
  };

  const uploadContentImage = async (file: File) => {
    return uploadFile(file, 'content-image');
  };

  const uploadAvatar = async (file: File) => {
    return uploadFile(file, 'avatar');
  };

  const uploadFile = async (file: File, type: 'book-cover' | 'content-image' | 'avatar') => {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/upload/${type}`,
        formData,
      );

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Upload failed';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    uploadBookCover,
    uploadContentImage,
    uploadAvatar,
  };
};
