import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { RootState } from "../../app/store";
import { setProfile } from "./profileSlice";
import api from "../../libs/axios";
import type { ProfileResponse } from "./types/profile";

const Profile: React.FC = () => {
  const profile = useAppSelector((state: RootState) => state.profile);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<ProfileResponse>("/api/users/profile");
        dispatch(setProfile(data));
      } catch (err: any) {
        const data = err?.response?.data;
        setError(
          data?.error ??
          data?.message ??
          "Something went wrong. Please try again."
        );
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            View your account information.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">

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

            {/* Created At */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">
                Created At
              </span>
              <span className="text-sm text-gray-900">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
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
                  ? new Date(profile.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;