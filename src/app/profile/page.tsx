'use client';

import { UserButton, SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <UserButton afterSignOutUrl="/" />
        <div className="text-center">
          <div className="text-lg font-semibold">{user?.fullName || user?.username || 'User'}</div>
          <div className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</div>
        </div>
        <SignOutButton redirectUrl='/'/>
      </div>
    </div>
  );
} 