# Specification

## Summary
**Goal:** Replace Google authentication with an admin-controlled username/password system where only admins can create accounts for students and staff.

**Planned changes:**
- Remove all Internet Identity and Google authentication dependencies from the frontend
- Replace the 'Sign in with Google' button with a traditional username/password login form
- Implement secure backend credential storage with password hashing in Motoko
- Create backend authentication function that verifies credentials and manages sessions
- Build an admin-only account creation interface with username, password, role, and name fields
- Update useAuth hook to manage username/password authentication instead of Internet Identity
- Update useActor hook to use session-based authentication
- Remove ProfileSetupModal component since profiles will be created by admins
- Preserve existing user profile data during the authentication system transition

**User-visible outcome:** Admins can create accounts for students and staff with usernames and passwords. All users log in using their admin-provided credentials instead of Google authentication. The login page displays a username/password form in dark mode styling.
