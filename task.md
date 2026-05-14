# 🚀 Stage 5 - Chat App Improvement Task

Welcome, Mobile Ninjas 🥷! Stage 5 is live.

Eligible: Flutter and React Native interns.
Kotlin: Stage 5 is a team task only. Coordinate with your mentor.
⏰ Deadline: Thursday, 14 May 2026 · 11:59 PM your local time
Total: 100 pts · Pass: 70
Submit: /submit in the stage-5-mobile channel.

## Starters

Clone and improve the starter. Do not rebuild from scratch.

- [React Native](https://github.com/logickoder/react-native-chat-starter) — Expo SDK 55, TypeScript, Firebase
- [Flutter](https://github.com/logickoder/flutter-chat-starter) — current stable, Firebase

## Backend Setup

Set up your own Firebase project. Replace the placeholder config. Do not use anyone else's keys.

The starter has no new chat UI. Build one first by searching by email or displayName and creating a conversations document with both UIDs. This is not graded as a feature, but missing it means no demo is possible.

## Required Features

All six features below are required:

1. Typing indicator — animated dots, real-time
2. Emoji reactions — long-press, instant sync
3. Audio messages — record, playback, 1x and 2x speed
4. Image and video messages — gallery picker, client-side compression mandatory, raw uploads rejected, thumbnails plus fullscreen viewer
5. Read receipts — Sent → Delivered → Seen, real-time
6. In-chat search — highlight, loading, and no-results states
7. Edit and delete — edited label, delete-for-me and delete-for-everyone, server-enforced ownership

## Non-Functional Must-Haves

- Declared state management library: Zustand, Redux, or Jotai for React Native; Riverpod, Bloc, or Provider for Flutter. No setState pyramids.
- Loading, error, and empty states on every async screen.
- Realtime sync under 2 seconds without manual refresh.
- Offline send queues that deliver on reconnect.

## Deliverables

- Public GitHub repo with clean commit history
- Working [Appetize.io](http://appetize.io/) link
- Demo video, 2 to 3 minutes, with two devices side by side mandatory. Accepted setups include physical plus emulator, two emulators, Vysor, or Genymotion. Single-device videos are rejected.
- LinkedIn or X post tagging @hnginternship with #HNGInternship #HNGStage5

## Grading Bands

Total: 100 pts

- Architecture — 10
- State management — 15
- UI/UX — 15
- Code quality — 30
- Loading, error, and reload — 15
- Docs and submission — 15

## Notes

Solo and team interns are judged differently: team interns are judged alongside the team task, while solo interns are judged only on this task with a stricter rubric application.

📘 Full brief covers acceptance criteria, rubric bands, README template, and checklist.

⚠️ `/submit` locks Thursday at 23:59 local time. No late submissions.

Good luck. 💪
