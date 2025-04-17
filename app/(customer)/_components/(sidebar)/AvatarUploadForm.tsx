"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User as UserIcon, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "../../SessionProvider";
import { uploadAvatar, uploadBackground, deleteAvatar, deleteBackground } from "./_profile-actions/profile-upload";

interface AvatarUploadFormProps {
  avatarUrl: string | null;
  backgroundUrl?: string | null;
  onSuccess: (newAvatarUrl: string | null, newBackgroundUrl?: string | null) => void;
  onClose: () => void;
}

export default function AvatarUploadForm({
  avatarUrl,
  backgroundUrl = null,
  onSuccess,
  onClose,
}: AvatarUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBgFile, setSelectedBgFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [previewBgUrl, setPreviewBgUrl] = useState<string | null>(backgroundUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'avatar' | 'background'>('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatar, updateBackground } = useSession();

  // Check if updateAvatar accepts null
  const safeUpdateAvatar = (url: string | null) => {
    if (url === null && updateAvatar) {
      try {
        updateAvatar("");
      } catch (e) {
        console.error("Failed to update avatar with empty string:", e);
      }
    } else if (updateAvatar) {
      updateAvatar(url as string);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);

    // Create a preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    return () => {
      if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    };
  };

  const handleBgFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedBgFile(file);

    // Create a preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewBgUrl(newPreviewUrl);

    return () => {
      if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    };
  };

  const handleDeleteAvatar = async () => {
    setIsUploading(true);
    
    try {
      // Use server action instead of fetch
      const result = await deleteAvatar();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to delete avatar");
      }
      
      // Update the preview
      setPreviewUrl(null);
      setSelectedFile(null);
      
      // Update session context
      safeUpdateAvatar(null);
      
      // Call success callback
      onSuccess(null, backgroundUrl);
      
      toast.success("Avatar deleted successfully");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting avatar"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBackground = async () => {
    setIsUploading(true);
    
    try {
      // Use server action to delete background
      const result = await deleteBackground();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to delete background");
      }
      
      // Update the preview
      setPreviewBgUrl(null);
      setSelectedBgFile(null);
      
      // Update session context
      if (updateBackground) {
        updateBackground(null);
      }
      
      // Call success callback
      onSuccess(avatarUrl, null);
      
      toast.success("Background deleted successfully");
    } catch (error) {
      console.error("Error deleting background:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting background"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      if (activeTab === 'avatar') {
        if (!selectedFile && previewUrl) {
          // No changes to existing avatar
          onClose();
          return;
        }
        
        if (selectedFile) {
          const formData = new FormData();
          formData.append("avatar", selectedFile);

          try {
            const result = await uploadAvatar(formData);

            if (!result.success || !result.avatarUrl) {
              throw new Error(result.error || "Failed to upload avatar");
            }

            // Call the success callback with the new URL
            onSuccess(result.avatarUrl, backgroundUrl);

            // Update the avatar in the session context
            safeUpdateAvatar(result.avatarUrl);

            toast.success("Avatar updated successfully");
          } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred while uploading avatar"
            );
            setIsUploading(false);
            return;
          }
        }
      } else {
        // Handle background image upload using server action
        if (selectedBgFile) {
          const formData = new FormData();
          formData.append("background", selectedBgFile);

          try {
            // Use uploadBackground server action
            const result = await uploadBackground(formData);

            if (!result.success || !result.backgroundUrl) {
              throw new Error(result.error || "Failed to upload background");
            }

            // Call the success callback with the new background URL
            onSuccess(avatarUrl, result.backgroundUrl);
            
            // Update the background in the session context
            if (updateBackground) {
              updateBackground(result.backgroundUrl);
            }

            toast.success("Background updated successfully");
          } catch (error) {
            console.error("Error uploading background:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "An error occurred while uploading background"
            );
            setIsUploading(false);
            return;
          }
        }
      }
      
      onClose();
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Edit Profile Media
      </h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab('avatar')}
          className={`py-2 px-4 rounded-full ${
            activeTab === 'avatar' 
              ? 'bg-teal-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Profile Picture
        </button>
        <button
          onClick={() => setActiveTab('background')}
          className={`py-2 px-4 rounded-full ${
            activeTab === 'background' 
              ? 'bg-teal-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Background Image
        </button>
      </div>

      {activeTab === 'avatar' ? (
        <div className="mb-6">
          <div className="mb-6 mx-auto w-32 h-32 relative">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover border-4 border-teal-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-600 rounded-full border-4 border-teal-500">
                <UserIcon size={64} className="text-slate-300" />
              </div>
            )}
          </div>

          <div className="mb-6 flex gap-2">
            <div className="flex-1">
              <label htmlFor="avatar-upload" className="sr-only">
                Choose profile picture
              </label>
              <input
                ref={fileInputRef}
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                aria-label="Upload profile picture"
                title="Choose a profile picture to upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-3 bg-teal-500 text-white rounded text-center font-medium hover:bg-teal-400 transition cursor-pointer flex items-center justify-center"
                aria-controls="avatar-upload"
              >
                <Upload size={18} className="mr-2" />
                Upload Image
              </button>
            </div>
            
            {previewUrl && (
              <button
                onClick={handleDeleteAvatar}
                className="py-3 px-4 bg-red-500 text-white rounded text-center font-medium hover:bg-red-400 transition cursor-pointer"
                disabled={isUploading}
                aria-label="Delete profile picture"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-500" aria-live="polite">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-6 mx-auto h-32 w-64 relative bg-slate-100 rounded-md overflow-hidden border-2 border-teal-500">
            {previewBgUrl ? (
              <Image
                src={previewBgUrl}
                alt="Background Preview"
                width={256}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-200">
                <ImageIcon size={64} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="mb-6 flex gap-2">
            <div className="flex-1">
              <label htmlFor="background-upload" className="sr-only">
                Choose background image
              </label>
              <input
                ref={bgFileInputRef}
                id="background-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBgFileSelect}
                aria-label="Upload background image"
                title="Choose a background image to upload"
              />
              <button
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full py-3 px-3 bg-teal-500 text-white rounded text-center font-medium hover:bg-teal-400 transition cursor-pointer flex items-center justify-center"
                aria-controls="background-upload"
              >
                <Upload size={18} className="mr-2" />
                Upload Background
              </button>
            </div>
            
            {previewBgUrl && (
              <button
                onClick={handleDeleteBackground}
                className="py-3 px-4 bg-red-500 text-white rounded text-center font-medium hover:bg-red-400 transition cursor-pointer"
                disabled={isUploading}
                aria-label="Delete background"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          
          {selectedBgFile && (
            <p className="mt-2 text-sm text-gray-500" aria-live="polite">
              Selected: {selectedBgFile.name}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="w-1/2 py-3 px-3 bg-slate-200 rounded text-slate-800 text-center font-medium hover:bg-slate-300 transition"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-1/2 py-3 px-3 bg-teal-500 rounded text-white text-center font-medium hover:bg-teal-400 transition disabled:bg-teal-300 disabled:cursor-not-allowed"
          disabled={isUploading || (activeTab === 'avatar' ? (!selectedFile && !previewUrl) : !selectedBgFile)}
        >
          {isUploading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
}