/* eslint-disable react-refresh/only-export-components */
import { useUser, useAuth, SignIn, SignUp, SignOutButton } from '@clerk/clerk-react';

export function useAppAuth() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  return {
    isSignedIn,
    userId,
    user,
    email: user?.primaryEmailAddress?.emailAddress,
    fullName: user?.fullName,
    avatarUrl: user?.imageUrl,
    getToken,
  };
}

export function ClerkSignInWrapper() {
  return (
    <div className="flex justify-center items-center py-4">
      <SignIn routing="hash" />
    </div>
  );
}

export function ClerkSignUpWrapper() {
  return (
    <div className="flex justify-center items-center py-4">
      <SignUp routing="hash" />
    </div>
  );
}

export function AppSignOutButton() {
  return (
    <SignOutButton>
      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium">
        Đăng xuất
      </button>
    </SignOutButton>
  );
}
