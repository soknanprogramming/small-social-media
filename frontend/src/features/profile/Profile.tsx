import React, { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { RootState } from "../../app/store";
import { setProfile } from "./profileSlice";
import api from "../../libs/axios";
import type { ProfileResponse } from "./types/profile";

const Profile: React.FC = () => {
  const profile = useAppSelector((state: RootState) => state.profile);
  const dispatch = useAppDispatch();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<ProfileResponse>("/api/users/profile");
        dispatch(setProfile(data));
      } catch (err: any) {
        const data = err?.response?.data;
        setFetchError(
          data?.error ??
            data?.message ??
            "Something went wrong. Please try again.",
        );
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleEditOpen = () => {
    setName(profile.name ?? "");
    setBio(profile.bio ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    if (!name.trim()) {
      setSaveError("Name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    if (bio.trim()) formData.append("bio", bio.trim());
    if (avatarFile) formData.append("avatar", avatarFile);

    setIsSaving(true);
    try {
      const { data } = await api.put<ProfileResponse>(
        "/api/users/profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      dispatch(setProfile(data));
      setSaveSuccess(true);
      setIsEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err: any) {
      const resData = err?.response?.data;
      console.error("Profile update error:", resData);
      setSaveError(
        resData?.error ??
          resData?.message ??
          "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = avatarPreview ?? profile.avatarUrl ?? null;
  const initials = profile.name
    ? profile.name.trim().charAt(0).toUpperCase()
    : (profile.email?.charAt(0).toUpperCase() ?? "?");

  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your account information.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditOpen}
              className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm mb-6">
            <span>{fetchError}</span>
          </div>
        )}

        {/* Save Success Banner */}
        {saveSuccess && !isEditing && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm mb-6">
            <span>Profile updated successfully.</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center ring-2 ring-gray-100">
                  <span className="text-white text-xl font-semibold">
                    {initials}
                  </span>
                </div>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                  title="Change avatar"
                >
                  <svg
                    className="w-3.5 h-3.5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-2.829 1.172H7v-2a4 4 0 011.172-2.828z"
                    />
                  </svg>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profile.name || "No name set"}
              </p>
              <p className="text-sm text-gray-500">{profile.email || "N/A"}</p>
            </div>
          </div>

          {isEditing ? (
            /* ── Edit Form ── */
            <div className="flex flex-col gap-5">
              {/* Save Error */}
              {saveError && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {saveError}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Bio{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleEditClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View Mode ── */
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm text-gray-900">
                  {profile.email || "N/A"}
                </span>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <span className="text-sm text-gray-900">
                  {profile.name || "N/A"}
                </span>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Bio</span>
                <span className="text-sm text-gray-900 whitespace-pre-wrap">
                  {profile.bio || (
                    <span className="text-gray-400 italic">
                      No bio added yet.
                    </span>
                  )}
                </span>
              </div>

              {/* Created At */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Created At
                </span>
                <span className="text-sm text-gray-900">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Updated At */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Updated At
                </span>
                <span className="text-sm text-gray-900">
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
