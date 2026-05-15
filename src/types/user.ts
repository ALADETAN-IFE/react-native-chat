export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  online?: boolean;
  lastSeen?: string | number;
}
