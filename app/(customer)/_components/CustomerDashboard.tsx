"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, ShoppingBag, Heart, MessageSquare, 
  Calendar, CreditCard, Settings, HelpCircle, 
  Pencil, Trash2
} from 'lucide-react';
import { useSession } from "@/app/SessionProvider";

interface CustomerSidebarProps {
  orderCount?: number;
  wishlistCount?: number;
}

export default function CustomerSidebar({
  orderCount = 0,
  wishlistCount = 0
}: CustomerSidebarProps) {
  const { user, updateAvatar, updateBackground } = useSession();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'background'>('avatar');

  const handleUpdateAvatar = async (file: File | null) => {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        const response = await fetch('/api/user/update-profile-image', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (data.success && data.avatarUrl) {
          updateAvatar(data.avatarUrl);
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    } else {
      try {
        const response = await fetch('/api/user/delete-profile-image', {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          updateAvatar(null);
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }
  };

  const handleUpdateBackground = async (file: File | null) => {
    if (file) {
      const formData = new FormData();
      formData.append('background', file);
      
      try {
        const response = await fetch('/api/user/update-background-image', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (data.success && data.backgroundUrl) {
          updateBackground(data.backgroundUrl);
        }
      } catch (error) {
        console.error('Error uploading background:', error);
      }
    } else {
      try {
        const response = await fetch('/api/user/delete-background-image', {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          updateBackground(null);
        }
      } catch (error) {
        console.error('Error deleting background:', error);
      }
    }
  };

  const openUploadModal = (type: 'avatar' | 'background') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="w-64 border-r border-gray-200 h-full flex flex-col">
      {/* Background Image Section */}
      <div className="relative h-40">
        <div className="absolute inset-0">
          {user?.backgroundUrl ? (
            <Image 
              src={user.backgroundUrl} 
              alt="Background" 
              layout="fill" 
              objectFit="cover"
              className="bg-gray-100"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        
        {/* Background Image Edit Button */}
        <button 
          onClick={() => openUploadModal('background')}
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
        >
          <Pencil size={16} />
        </button>
        
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
            {user?.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt={user.displayName || user.username} 
                layout="fill" 
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
            )}
            
            {/* Profile Image Edit Button */}
            <button 
              onClick={() => openUploadModal('avatar')}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* User Info */}
      <div className="mt-14 px-4 mb-6">
        <h3 className="font-semibold text-lg">{user?.displayName || user?.username}</h3>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <User className="w-5 h-5 mr-3" />
              <span>Go To Home</span>
            </Link>
          </li>
          <li>
            <Link href="/orders" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <ShoppingBag className="w-5 h-5 mr-3" />
              <span>My Orders ({orderCount})</span>
            </Link>
          </li>
          <li>
            <Link href="/wishlist" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <Heart className="w-5 h-5 mr-3" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
          </li>
          {/* Other navigation items... */}
        </ul>
      </nav>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {uploadType === 'avatar' ? 'Profile Picture' : 'Background Image'}
            </h3>
            
            <div className="space-y-4">
              <label className="block">
                <span className="sr-only">Choose {uploadType} image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (uploadType === 'avatar') {
                      handleUpdateAvatar(file);
                    } else {
                      handleUpdateBackground(file);
                    }
                    setIsUploadModalOpen(false);
                  }}
                />
              </label>
              
              {(uploadType === 'avatar' && user?.avatarUrl) || 
               (uploadType === 'background' && user?.backgroundUrl) ? (
                <button
                  onClick={() => {
                    if (uploadType === 'avatar') {
                      handleUpdateAvatar(null);
                    } else {
                      handleUpdateBackground(null);
                    }
                    setIsUploadModalOpen(false);
                  }}
                  className="w-full py-2 px-4 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                >
                  <Trash2 className="inline mr-2" size={16} />
                  Delete Current {uploadType === 'avatar' ? 'Profile Picture' : 'Background'}
                </button>
              ) : null}
              
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}