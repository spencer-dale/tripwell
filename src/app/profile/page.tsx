'use client';

import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <div className="text-center">
            <div className="text-lg font-semibold">{user?.fullName || user?.username || 'User'}</div>
            <div className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => window.location.href = '/sign-out'}
          >
            Log out
          </button>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-700">You are not signed in.</p>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
} 