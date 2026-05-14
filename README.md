# HNG Stage 5 — React Native Starter

Intentionally rough chat-app baseline. Improve this. Do not rebuild it.

## Setup

```bash
pnpm install
cp .env.example .env
# fill in Firebase config in .env
pnpm start
```

Open on iOS Simulator, Android Emulator, or Expo Go on device.

### Expo Go caveat (SDK 55)

The Expo Go versions on the App Store and Google Play may lag behind SDK 55 releases. See [expo/expo#43699](https://github.com/expo/expo/issues/43699).

- **Android** — run `pnpm start` then choose "Open on Android" from the dev menu. This downloads the latest Expo Go build directly to the device, bypassing the Play Store version.
- **iOS** — use the Expo Go TestFlight build (SDK 55 compatible) instead of the App Store version.
- **Recommended** — use a development build to avoid Expo Go version constraints entirely.

## Firebase setup

1. Create a project at https://console.firebase.google.com.
2. Enable **Email/Password** in Authentication → Sign-in method.
3. Create a **Firestore Database** (production mode is fine — paste `firestore.rules` into the Rules tab).
4. Create a **Storage bucket** (default settings).
5. In Project settings → General → Your apps, add a Web app and copy the config keys into `.env` (the `EXPO_PUBLIC_FIREBASE_*` variables).

## What's missing — your job to add

The starter intentionally ships rough. You are graded on closing these gaps:

1. No loading spinners anywhere.
2. No error toasts or alerts — errors crash or silently fail.
3. No empty states — empty lists show a blank screen.
4. No keyboard-avoiding behavior on the chat input.
5. No FlatList autoscroll on new messages.
6. No auth route guard — anyone can deep-link to `/chats` while logged out.
7. All `useState`/`useEffect` live in screens — no custom hooks, no state library.
8. Firestore listeners set up directly in screen `useEffect` blocks.
9. No input validation on login/signup.
10. No `try/catch` around any Firestore or Auth call.
11. No offline persistence enabled.
12. No user profile creation — `users/{uid}` doc is never written.
13. No way to start a new conversation — you must build this yourself.

## Stage 5 brief

See the main Stage 5 brief for grading criteria and submission instructions.
