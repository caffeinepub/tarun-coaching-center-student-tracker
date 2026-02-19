# Specification

## Summary
**Goal:** Enable admin-only daily updates for marks, test subjects, and attendance with role-based access control.

**Planned changes:**
- Implement backend admin role verification for marks, test subjects, and attendance operations
- Create backend functionality to manage test subjects (add, edit, retrieve)
- Add admin interface for test subject management
- Enhance marks recording interface with test subject dropdown and daily update capability
- Enhance attendance interface to support daily updates by admins
- Implement role-based UI rendering to show/hide admin-only features based on user role

**User-visible outcome:** Admin users can daily update student marks (selecting from managed test subjects), manage test subjects, and update attendance records. Non-admin users (Teacher, Staff) see read-only views without update controls.
