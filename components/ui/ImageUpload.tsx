'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  altText?: string;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  altText = 'Preview',
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync preview with value if it changes externally (e.g. form reset)
  useEffect(() => {
    setPreview(value);
    setError(null); // Clear error on external value change
  }, [value]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Setup AbortController for race condition mitigation
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.path) {
        onChange(data.path);
        setPreview(data.path);
      } else {
        throw new Error('Upload failed: missing path');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setPreview(value); // Revert to previous value
        setError('Rasm yuklashda xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    } finally {
      if (abortRef.current === controller) {
        setUploading(false);
      }
    }
  };

  const handleRemove = async () => {
    setError(null);
    if (value) {
      try {
        const res = await fetch('/api/admin/delete-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: value }),
        });
        if (!res.ok) {
          console.error('Failed to delete photo on server:', res.statusText);
        }
      } catch (err) {  
        console.error('Failed to delete photo:', err);
      }
    }
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={altText}
            className="h-48 w-full rounded-[12px] object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
          >
            <X size={14} />
          </button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-black/40">
              <Loader2 className="animate-spin text-white" size={28} />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-48 w-full flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-outline-variant/30 bg-surface-low transition-colors hover:border-primary/30 hover:bg-surface"
        >
          <Upload className="text-on-surface-variant" size={28} />
          <span className="mt-2 text-sm text-on-surface-variant">
            Rasm yuklash (max 5MB)
          </span>
          <span className="mt-1 text-xs text-on-surface-variant/60">
            JPEG, PNG, WebP
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
      />
      {error && (
        <p className="text-xs text-error font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
