'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.path) {
        onChange(data.path);
        setPreview(data.path);
      }
    } catch {
      // Error handling
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (value) {
      fetch('/api/admin/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: value }),
      });
    }
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
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
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
