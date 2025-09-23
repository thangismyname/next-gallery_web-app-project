// pages/UserPage.tsx
import React from "react";
import { getCurrentUser } from "../services/authService";

const UserPage: React.FC = () => {
  const user = getCurrentUser();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold">
        Welcome, {user?.firstName || "User"}
      </h1>
      <p className="mt-2 text-gray-600">This is your profile page.</p>
      {/* You can add avatar, email, role, etc. here */}
    </div>
  );
};

export default UserPage;
