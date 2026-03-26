import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { RootState } from "../../app/store";
import { setProfile } from "./profileSlice";
import api from "../../libs/axios";
import type { ProfileResponse } from "./types/profile";

const Profile: React.FC = () => {
  const profile = useAppSelector((state: RootState) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<ProfileResponse>("/api/users/profile");
        dispatch(setProfile(data));
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Name:</strong> {profile.name || "N/A"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {profile.createdAt
          ? new Date(profile.createdAt).toLocaleDateString()
          : "N/A"}
      </p>

      <p>
        <strong>Updated At:</strong>{" "}
        {profile.updatedAt
          ? new Date(profile.updatedAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
};

export default Profile;
