"use client";

import Image from "next/image";
import Link from "next/link";
import { User as UserIcon, Edit } from "lucide-react";
import { SessionUser } from "@/app/SessionProvider";

interface ProfileSectionProps {
  user: SessionUser;
  isCollapsed: boolean;
  onEditProfile?: () => void;
}

export default function ProfileSection({ user, isCollapsed, onEditProfile }: ProfileSectionProps) {
  // Determine display name
  const displayName = user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.username;
  
  return (
    <div className="relative">
      {/* Background Image - only show when sidebar is expanded */}
      {!isCollapsed && user.backgroundUrl && (
        <div className="w-full h-32 relative">
          <Image 
            src={user.backgroundUrl}
            alt="Profile background"
            width={256}
            height={128}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent opacity-60"></div>
          
          {/* Edit button for background - positioned in top right corner */}
          {onEditProfile && (
            <button 
              onClick={onEditProfile}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 transition rounded-full p-1"
              aria-label="Edit background image"
            >
              <Edit size={16} /> 
            </button>
          )}
        </div>
      )}
      
      <div className={`flex ${isCollapsed ? "justify-center" : "justify-between"} p-4 ${!isCollapsed && user.backgroundUrl ? "absolute bottom-0 left-0 right-0" : ""}`}>
        <div className="flex items-center">
          <div className="relative">
            <Link href="/account/profile" className="block">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={displayName}
                  width={isCollapsed ? 32 : 48}
                  height={isCollapsed ? 32 : 48}
                  className="rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <div className={`${isCollapsed ? "w-8 h-8" : "w-12 h-12"} rounded-full bg-teal-500 flex items-center justify-center border-2 border-white shadow-md`}>
                  <UserIcon size={isCollapsed ? 16 : 24} className="text-white" />
                </div>
              )}
            </Link>
            
            {/* Avatar edit button - shown on hover */}
            {!isCollapsed && onEditProfile && (
              <button
                onClick={onEditProfile}
                className="absolute -bottom-1 -right-1 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-1 shadow-md transition-all duration-200"
                aria-label="Edit profile picture"
              >
                <Edit size={12} />
              </button>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="ml-3">
              <Link 
                href="/account/profile"
                className="font-medium text-white hover:text-teal-300 transition block"
              >
                {displayName}
              </Link>
              <p className="text-slate-300 text-sm truncate max-w-[140px]">
                {user.username}
              </p>
            </div>
          )}
        </div>
        
        {/* Profile settings button */}
        {!isCollapsed && onEditProfile && (
          <button 
            onClick={onEditProfile}
            className="text-slate-300 hover:text-white transition rounded-full p-1 hover:bg-slate-600 self-start"
            aria-label="Edit profile"
          >
            <Edit size={16} /> 
          </button>
        )}
      </div>
      
      {/* Add a spacer when using background to ensure proper layout */}
      {!isCollapsed && user.backgroundUrl && (
        <div className="h-16"></div>
      )}
    </div>
  );
}