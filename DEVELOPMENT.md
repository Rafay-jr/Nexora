# EventSphere (Nexora) - Development & Architecture Guide (Step 1)

Welcome to the backend documentation for **EventSphere** (College Event Information & Management Platform).

---

## 1. System Requirements & Environment

- **PHP Version**: PHP 8.2+ (XAMPP environment)
- **Database**: MySQL / MariaDB 10.4+ (`eventsphere_db`)
- **Backend Framework**: Laravel 11.x
- **Authentication Scaffolding**: Laravel Sanctum API Token Authentication

---

## 2. Environment Configuration (`.env`)

Configure your local `.env` database settings:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventsphere_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## 3. Database Commands

### Execute Database Migrations & Seeders:
```bash
php artisan migrate:fresh --seed
```

### Import Pre-generated SQL Dump into MySQL:
If importing directly into phpMyAdmin or MySQL client:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS eventsphere_db;"
mysql -u root eventsphere_db < eventsphere_schema_and_seeds.sql
```

The pre-generated dump file `eventsphere_schema_and_seeds.sql` contains the complete 12-table schema and all realistic seed data.

---

## 4. Default Seed Credentials

All seed accounts use the default password: **`password123`**

| Role | Name | Email | Username | Department / Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | System Administrator | `admin@eventsphere.test` | `admin` | Administration |
| **Organizer 1** | Prof. Rajesh Sharma | `prof.sharma@eventsphere.test` | `prof_sharma` | Computer Science & Eng. |
| **Organizer 2** | Dr. Meera Verma | `dr.verma@eventsphere.test` | `dr_verma` | Cultural & Fine Arts |
| **Participant 1** | Aarav Patel | `student1@eventsphere.test` | `aarav_patel` | Computer Science (EN2024001) |
| **Participant 2** | Ananya Roy | `student2@eventsphere.test` | `ananya_roy` | Information Tech (EN2024002) |
| **Participant 3** | Rohan Gupta | `student3@eventsphere.test` | `rohan_gupta` | Mechanical Eng (EN2024003) |
| **Participant 4** | Sneha Rao | `student4@eventsphere.test` | `sneha_rao` | Electronics (EN2024004) |
| **Participant 5** | Vikram Singh | `student5@eventsphere.test` | `vikram_singh` | Civil Engineering (EN2024005) |

---

## 5. Normalized Database Tables (12 Entities)

1. `users`: Core account system with role (`admin`, `organizer`, `participant`) and status (`active`, `suspended`).
2. `user_details`: Student/Staff profiles (mobile, department, enrollment number).
3. `events`: College events with categories, venue capacity, approval status (`pending`, `approved`, `rejected`), status (`active`, `completed`, `cancelled`).
4. `registrations`: Unique event sign-ups with status (`confirmed`, `cancelled`, `waitlist`) and QR tokens.
5. `attendances`: Marked event check-ins.
6. `feedback`: Post-event ratings (1-5), venue/technical/coordination/hospitality ratings, and written comments.
7. `certificates`: Issued e-certificates and fee payment flags.
8. `media_galleries`: Images and videos categorized by type, event, department, and year.
9. `event_waitlists`: Queue management for events reaching maximum venue capacity with auto-promotion.
10. `calendar_syncs`: Sync logs for Google, Outlook, and Apple (.ics).
11. `event_share_logs`: Social media share analytics (WhatsApp, Facebook, LinkedIn, Twitter, Instagram, Email).
12. `notifications`: System-wide announcements and role-targeted notifications.

---

## 6. REST API Endpoints Overview

### Public & Visitor Routes (`/api/...`)
- `POST /api/auth/register`: Create student/organizer account
- `POST /api/auth/login`: Authenticate user & retrieve Sanctum bearer token
- `GET /api/events`: List events (filter by category, department, date range, venue, keyword)
- `GET /api/events/{id}`: Detailed event information and capacity availability
- `GET /api/gallery`: Media gallery images/videos
- `GET /api/announcements`: Public announcements & notices
- `GET /api/sitemap`: Public sitemap URLs

### Participant Routes (`/api/participant/...`)
- `GET /api/participant/dashboard`: Student participation summary & status
- `POST /api/participant/register-event`: Register for event (enforces seating limits & auto-waitlists)
- `POST /api/participant/cancel-registration/{id}`: Cancel registration (triggers auto-promotion of waitlist)
- `POST /api/participant/feedback`: Submit post-event review & ratings
- `GET /api/participant/certificates`: View & download e-certificates
- `POST /api/participant/calendar-sync`: Sync event to Google/Outlook/Apple calendar
- `POST /api/participant/share-log`: Log social media event share

### Organizer Routes (`/api/organizer/...`)
- `GET /api/organizer/dashboard`: Organizer stats & event overviews
- `POST /api/organizer/events`: Create event (submits for Admin approval)
- `PUT /api/organizer/events/{id}`: Update/reschedule event details
- `GET /api/organizer/events/{id}/registrations`: View event registrant list
- `POST /api/organizer/attendance/scan`: Validate QR code & mark attendance
- `POST /api/organizer/certificates/upload`: Issue e-certificate
- `POST /api/organizer/media/upload`: Add media to campus gallery

### Admin Routes (`/api/admin/...`)
- `GET /api/admin/dashboard`: System-wide metrics & role counts
- `GET /api/admin/pending-events`: View event proposals awaiting approval
- `POST /api/admin/events/{id}/approve`: Approve event proposal
- `POST /api/admin/events/{id}/reject`: Reject event proposal with reason
- `GET /api/admin/users`: Manage platform users
- `PUT /api/admin/users/{id}/role`: Upgrade or change user role
- `PUT /api/admin/users/{id}/status`: Activate or suspend user account
- `POST /api/admin/events/{id}/capacity`: Adjust venue seating capacity dynamically
- `GET /api/admin/reports`: Generate analytics reports
