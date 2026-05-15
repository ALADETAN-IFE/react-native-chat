type FirebaseLikeError = {
  code?: string;
  message?: string;
};

export function getAuthErrorMessage(error: unknown): string {
  const { code } = error as FirebaseLikeError;

  switch (code) {
    case 'auth/weak-password':
      return 'Your password must be at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Check the email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function getFirestoreErrorMessage(error: unknown): string {
  const { code, message = '' } = error as FirebaseLikeError;

  if (code === 'permission-denied') {
    return "You don't have permission to view this data.";
  }

  if (
    code === 'failed-precondition' &&
    (message.includes('index') || message.includes('requires an index'))
  ) {
    return 'Your chat list is still setting up. Create the Firestore index (see README or the link in your dev console), then reload the app.';
  }

  if (code === 'unavailable') {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  return 'Something went wrong loading data. Please try again.';
}
