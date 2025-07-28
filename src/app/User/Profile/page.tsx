"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adlam } from '@/utils/fonts';
import { roboto } from '@/utils/fonts';
import { abeezee } from '@/utils/fonts';
import { useAuth } from '@/app/context/authContext';
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaLink, FaLock, FaTrash, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Countries data
const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Finland", "France", "Georgia", "Germany",
  "Ghana", "Greece", "Guatemala", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania",
  "Luxembourg", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
  "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Venezuela", "Vietnam", "Yemen"
];

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  location: string;
  personalLinks: string;
  profilePicture?: string;
  status: string;
}

export default function UserProfile() {
  const { logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    bio: "",
    location: "",
    personalLinks: "",
    status: "active",
    profilePicture: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          toast.error("No authentication token found");
          router.push("/Login_Register/Login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            logout();
            router.push("/Login_Register/Login");
            return;
          }
          throw new Error(`Failed to fetch user profile: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Fetched profile data:", data); // Debug log

        const profileData = {
          fullName: data.username || "No name",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          personalLinks: data.personalLinks || "",
          profilePicture: data.profilePictureUrl || "",
          status: data.status || "inactive",
        };

        setUserProfile(profileData);
        setEditedProfile(profileData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Unable to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(userProfile); // Reset changes
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      // Create the update payload matching your DTO
      const updatePayload = {
        bio: editedProfile.bio,
        location: editedProfile.location,
        personalLinks: editedProfile.personalLinks,
        profilePictureUrl: editedProfile.profilePicture
      };

      console.log("Sending update payload:", updatePayload); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        setUserProfile(editedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Update error:", errorData);
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
      
      const data = await res.json();
      console.log("Image upload response:", data); // Debug log
      
      // Update both states with the new image URL
      const newImageUrl = data.url;
      setEditedProfile((prev) => ({ ...prev, profilePicture: newImageUrl }));
      setUserProfile((prev) => ({ ...prev, profilePicture: newImageUrl }));
      
      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      if (response.ok) {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
        toast.success("Password changed successfully!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        logout();
        toast.success("Account deleted successfully");
        router.push("/Login_Register/Login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25019] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-center items-start">
          <h1 className={`text-3xl font-bold text-[#F25019] mt-4 ${adlam.className}`}>
            User Profile
          </h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFDC8F]/90 backdrop-blur rounded-xl shadow-lg p-6 min-h-100">
              <h2 className={`text-xl font-semibold text-[#F25019] mb-4 ${adlam.className}`}>
                Profile Overview
              </h2>
              
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6 relative">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover mb-2"
                    onError={(e) => {
                      console.log("Image load error:", e);
                      // Fallback to default avatar if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#F25019] rounded-full flex items-center justify-center mb-2">
                    <FaUser className="w-12 h-12 text-white" />
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-25 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
                    title="Edit profile picture"
                  >
                    <FaCamera className="w-4 h-4" />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfilePictureChange}
                />

                <span className={`text-xs text-gray-600 ${abeezee.className}`}>
                  Profile Picture
                </span>
              </div>

              {/* Read-only Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="w-4 h-4 text-[#F25019]" />
                  <div>
                    <p className={`text-xs text-gray-600 ${abeezee.className}`}>Full Name</p>
                    <p className={`font-medium ${roboto.className}`}>{userProfile.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-[#F25019]" />
                  <div>
                    <p className={`text-xs text-gray-600 ${abeezee.className}`}>Email</p>
                    <p className={`font-medium ${roboto.className}`}>{userProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${userProfile.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className={`text-xs text-gray-600 ${abeezee.className}`}>Status</p>
                    <p className={`font-medium capitalize ${roboto.className}`}>{userProfile.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 min-h-98">
              <h2 className={`text-xl font-semibold text-[#F25019] mb-4 ${adlam.className}`}>
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${abeezee.className}`}>
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F25019]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className={`text-gray-700 ${roboto.className}`}>{userProfile.bio || "No bio added yet."}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${abeezee.className}`}>
                    <FaMapMarkerAlt className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F25019]"
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  ) : (
                    <p className={`text-gray-700 ${roboto.className}`}>{userProfile.location || "Location not set"}</p>
                  )}
                </div>

                {/* Personal Links */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${abeezee.className}`}>
                    <FaLink className="inline w-4 h-4 mr-1" />
                    Personal/Social Links
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.personalLinks}
                      onChange={(e) => setEditedProfile({...editedProfile, personalLinks: e.target.value})}
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F25019]"
                      placeholder="Enter links separated by commas"
                    />
                  ) : (
                    <div className="space-y-1">
                      {userProfile.personalLinks
                        ? userProfile.personalLinks.split(',').map((link, index) => (
                        <a key={index} href={link.trim()} target="_blank" rel="noopener noreferrer" className={`block text-[#F25019] hover:underline ${roboto.className}`}>
                         {link.trim()}
                        </a>
                      ))
                        : <p className="italic text-gray-600">No links provided</p>
                }
                    </div>
                  )}
                </div>
                
                <div>
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300 ${
                      isEditing 
                        ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                        : 'bg-[#F25019] hover:bg-[#C93E0F] text-white'
                    } ${roboto.className}`}
                  >
                    {isEditing ? <FaTimes className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className={`flex items-center gap-2 px-6 py-2 bg-[#F25019] hover:bg-[#C93E0F] text-white rounded-md transition-colors duration-300 ${roboto.className}`}
                  >
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
          
           {/* Account Settings */}
           <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className={`text-xl font-semibold text-[#F25019] mb-4 ${adlam.className}`}>
                Account Settings
              </h2>

              <div className="space-y-4">
                {/* Change Password */}
                <div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className={`flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300 ${roboto.className}`}
                  >
                    <FaLock className="w-4 h-4" />
                    Change Password
                  </button>

                  {showPasswordForm && (
                    <form onSubmit={handlePasswordChange} className="mt-4 p-4 bg-gray-50 rounded-md space-y-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300"
                        >
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Delete Account */}
                <div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-300 ${roboto.className}`}
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete Account
                  </button>

                  {showDeleteConfirm && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className={`text-red-700 mb-3 ${roboto.className}`}>
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-300"
                        >
                          Yes, Delete Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}