import { useState } from 'react';
import { uploadAsset } from '../services/api.js';

export default function useUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function upload({ asset, type, category, description, task_id, language }) {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const result = await uploadAsset({
        asset, type, category, description, task_id, language,
        onProgress: setProgress,
      });
      return result;
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setProgress(0);
    setUploading(false);
    setError(null);
  }

  return { progress, uploading, error, upload, reset };
}
