"use client"


import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, ShoppingBag, Heart, MessageSquare, 
  Calendar, CreditCard, Settings, HelpCircle, 
  Pencil, Trash2
} from 'lucide-react';

interface CustomerSidebarProps {
  profileImage?: string;
  backgroundImage?: string;
  username: string;
  email: string;
  onUpdateProfileImage: (file: File | null) => void;
  onUpdateBackgroundImage: (file: File | null) => void;
}

export default function CustomerSidebar({
  profileImage = '/placeholder-avatar.png',
  backgroundImage = '/placeholder-bg.png',
  username = 'John Doe',
  email = 'john.doe@example.com',
  onUpdateProfileImage,
  onUpdateBackgroundImage
}: CustomerSidebarProps) {
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isBackgroundEditOpen, setIsBackgroundEditOpen] = useState(false);
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdateProfileImage(e.target.files[0]);
    }
    setIsProfileEditOpen(false);
  };
  
  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdateBackgroundImage(e.target.files[0]);
    }
    setIsBackgroundEditOpen(false);
  };
  
  const handleDeleteProfileImage = () => {
    onUpdateProfileImage(null);
    setIsProfileEditOpen(false);
  };
  
  const handleDeleteBackgroundImage = () => {
    onUpdateBackgroundImage(null);
    setIsBackgroundEditOpen(false);
  };

  return (
    <div className="w-64 border-r border-gray-200 h-full flex flex-col">
      {/* Background Image Section */}
      <div className="relative h-40">
        <div className="absolute inset-0">
          <Image 
            src={backgroundImage} 
            alt="Background" 
            layout="fill" 
            objectFit="cover"
            className="bg-gray-100"
          />
        </div>
        
        {/* Background Image Edit Button */}
        <button 
          onClick={() => setIsBackgroundEditOpen(!isBackgroundEditOpen)}
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
        >
          <Pencil size={16} />
        </button>
        
        {/* Background Image Edit Dropdown */}
        {isBackgroundEditOpen && (
          <div className="absolute top-10 right-2 bg-white p-2 rounded shadow-lg z-10">
            <label className="block mb-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
              <span className="text-sm">Upload new</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleBackgroundImageChange}
              />
            </label>
            <button 
              onClick={handleDeleteBackgroundImage}
              className="flex items-center text-sm text-red-500 hover:bg-gray-100 p-1 rounded w-full"
            >
              <Trash2 size={14} className="mr-1" /> Delete
            </button>
          </div>
        )}
        
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100">
            <Image 
              src={profileImage} 
              alt={username} 
              layout="fill" 
              objectFit="cover"
            />
            
            {/* Profile Image Edit Button */}
            <button 
              onClick={() => setIsProfileEditOpen(!isProfileEditOpen)}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md"
            >
              <Pencil size={16} />
            </button>
          </div>
          
          {/* Profile Image Edit Dropdown */}
          {isProfileEditOpen && (
            <div className="absolute top-16 left-24 bg-white p-2 rounded shadow-lg z-10">
              <label className="block mb-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                <span className="text-sm">Upload new</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileImageChange}
                />
              </label>
              <button 
                onClick={handleDeleteProfileImage}
                className="flex items-center text-sm text-red-500 hover:bg-gray-100 p-1 rounded w-full"
              >
                <Trash2 size={14} className="mr-1" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* User Info */}
      <div className="mt-14 px-4 mb-6">
        <h3 className="font-semibold text-lg">{username}</h3>
        <p className="text-gray-500 text-sm">{email}</p>
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
              <span>My Orders</span>
            </Link>
          </li>
          <li>
            <Link href="/wishlist" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <Heart className="w-5 h-5 mr-3" />
              <span>Wishlist</span>
            </Link>
          </li>
          <li>
            <Link href="/messages" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 mr-3" />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link href="/subscriptions" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <Calendar className="w-5 h-5 mr-3" />
              <span>Subscriptions</span>
            </Link>
          </li>
          <li>
            <Link href="/payment-methods" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <CreditCard className="w-5 h-5 mr-3" />
              <span>Payment Methods</span>
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/support" className="flex items-center px-4 py-3 hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 mr-3" />
              <span>Support</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}