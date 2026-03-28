import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../libs/axios";

// ── Icons ────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  content: string;
  published: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

const PostPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    title: "",
    content: "",
    published: false,
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted.");
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("published", String(form.published));
      if (form.content) formData.append("content", form.content);
      if (photo) formData.append("photo", photo);

      await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redirect to my posts on success
      navigate("/my_posts");
    } catch (err: any) {
      // Backend returns { error: "..." } for 400/500
      const data = err?.response?.data;
      setError(data?.error ?? data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Create Post</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to publish a new post.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Global error */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={5}
                value={form.content}
                onChange={handleChange}
                placeholder="Write your post content…"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Photo upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <ImageIcon />
                Photo <span className="text-gray-400 font-normal">(optional)</span>
              </label>

              {preview ? (
                /* Preview */
                <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-150" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-sm transition-colors duration-150"
                    aria-label="Remove photo"
                  >
                    <XIcon />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-black/40 text-white backdrop-blur-sm">
                    {photo?.name}
                  </span>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    flex flex-col items-center justify-center gap-3 px-6 py-10
                    rounded-lg border-2 border-dashed cursor-pointer
                    transition-colors duration-150
                    ${isDragging
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  <div className={`text-gray-300 transition-colors duration-150 ${isDragging ? "text-gray-400" : ""}`}>
                    <UploadIcon />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF, WEBP</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">Publish immediately</p>
                <p className="text-xs text-gray-400 mt-0.5">Make this post visible to everyone</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.published}
                onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
                className={`
                  relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300
                  ${form.published ? "bg-gray-800" : "bg-gray-200"}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
                    transform transition-transform duration-200 ease-in-out
                    ${form.published ? "translate-x-4" : "translate-x-0"}
                  `}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
              >
                {isSubmitting && <SpinnerIcon />}
                {isSubmitting ? "Publishing…" : "Create Post"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostPage;