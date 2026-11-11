# Admin Panel — Minevam Kigobe Church

This document explains the admin area added to the project. The admin can edit,
monitor, upload and delete the website's content without touching the code.

---

## 1. Getting started

Start the development server:

```sh
npm install
npm run dev
```

Then open the admin panel:

| Page | URL |
| --- | --- |
| Login | `/admin/login` |
| Dashboard | `/admin` |

**Default credentials**

```
Username: admin
Password: kigobe2024
```

> Change the username and password right after your first login, from
> **Settings → Admin account**. Credentials and all content are stored in the
> browser's `localStorage`.

---

## 2. What the admin can do

| Section | What you can do |
| --- | --- |
| **Dashboard** | See counts for every content type, storage usage, recent messages, recent activity and donation totals. |
| **Sermons** | Add, edit and delete sermon videos (YouTube ID, title, pastor, date, series, thumbnail, description). |
| **Video Feeds** | Connect the YouTube channel and Facebook page, sync their latest videos and review what was fetched. |
| **Events** | Add, edit and delete events (date block, title, time, location, category, description). |
| **Announcements** | Add, edit and delete the short notices shown in the events sidebar. |
| **Gallery** | Upload one or many photos at once, add photos by URL, edit captions/alt text and delete photos. |
| **Ministries** | Add, edit and delete ministries, including image, icon, member count and contact email. |
| **Leadership** | Add, edit and delete leaders shown in the About section. |
| **Donation** | Edit Lumicash/Ecocash pay-to numbers, account names and instructions; review and delete recorded donations. |
| **Prayer Requests** | Read, open and delete prayer requests submitted from the website. |
| **Messages** | Read contact-form messages, mark them read/unread and delete them. |
| **Newsletter** | View subscribers, add one manually, delete them and export the list to CSV. |
| **Pages & Content** | Edit hero text and images, About text, mission/vision/values, contact details, social links, map and footer verse. |
| **Files** | A media library: upload images, copy their data and delete them. |
| **Settings** | Change admin credentials, export/import a full JSON backup, restore default content and review/clear the activity log. |

The public website reads the same data, so edits appear on the site immediately
(after a refresh or navigation) — hero, about, sermons, events, announcements,
gallery, ministries, leadership, contact information, footer and donation
instructions.

---

## 3. Uploading and deleting files

- Images can be uploaded from **Gallery**, **Files**, **Sermons** (thumbnail),
  **Ministries**, and **Pages & Content** (hero/about images).
- Accepted formats: PNG, JPG, WEBP. **Maximum 2 MB per image.**
- Uploaded images are stored as data URLs inside the browser, so keep the total
  under roughly 5 MB.
- Delete any item with the trash icon. Deletions ask for confirmation.

---

## 4. Video feeds (YouTube & Facebook)

Go to **Video Feeds** in the admin sidebar to pull in the latest sermons and
other videos automatically.

### YouTube

The church channel is pre-configured:

- Name: **MINEVAM Kigobe Church**
- Handle: `@MinevamKigobe`
- Channel ID: `UC2izHHVAdji27tW8F-8JkeA`

No key is needed: videos are read from the channel's public RSS feed through a
CORS proxy. Because that feed is XML and does not allow browser requests
directly, the **CORS proxies** setting is used. It accepts one proxy per line;
requests race and the first successful proxy wins. AllOrigins and CodeTabs are
configured by default — remove or replace them with your own proxy, or add a
**YouTube Data API key** so the official API is used instead (most reliable in
production). If every proxy fails, the public page falls back to the channel's
embedded uploads playlist so visitors still see the latest videos.

### Facebook

The page URL defaults to `https://facebook.com/MinevamKigobe`. To fetch videos
programmatically, also enter:

- **Page ID** — the numeric ID of the Facebook page.
- **Page access token** — a token with the `pages_read_engagement` permission.

The token is stored only in this browser. Never use a personal token; create a
dedicated app token and rotate it if it is exposed. In production, route
Facebook requests through your own server so the token never reaches visitors.

### Behaviour

- Click **Sync now** to fetch immediately; **Save** stores the configuration.
- The public **Sermons** section shows a “Latest Videos” grid with YouTube and
  Facebook cards. YouTube videos play in a dialog; Facebook videos open on
  Facebook.
- The public site refreshes the feed automatically when the cache is older than
  30 minutes. The last 15 videos per source are kept.
- Use **Clear** in the “Cached videos” card to remove the cached feed.

---

## 5. Monitoring

The **Dashboard** and **Settings** pages show:

- Number of sermons, events, gallery photos, ministries, prayer requests,
  messages, subscribers and donation records.
- Unread messages and recent activity.
- Estimated browser storage usage.
- An activity log of every create, update, upload, delete, import and restore.

Messages, prayer requests and newsletter subscribers submitted from the public
forms are saved automatically and appear in the admin panel.

---

## 6. Backups

Because data lives in the browser, use backups:

1. Go to **Settings → Backup & restore**.
2. Click **Export backup** to download a JSON file with all content.
3. Use **Import backup** to restore it on the same or another browser.
4. **Restore all defaults** resets content to the original website values
   (messages, subscribers and prayer requests are kept).

> Clearing the browser's site data will erase the content. Always keep a backup.

---

## 7. Admin folder structure

```
src/
├── admin/
│   ├── components/
│   │   ├── AdminSidebar.tsx      # Navigation menu
│   │   ├── AdminUI.tsx           # Shared admin building blocks
│   │   └── ProtectedRoute.tsx    # Redirects to login when not signed in
│   ├── layouts/
│   │   └── AdminLayout.tsx       # Sidebar + header shell
│   ├── pages/                    # One page per admin section
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminSermons.tsx
│   │   ├── AdminVideos.tsx
│   │   ├── AdminEvents.tsx
│   │   ├── AdminAnnouncements.tsx
│   │   ├── AdminGallery.tsx
│   │   ├── AdminMinistries.tsx
│   │   ├── AdminLeadership.tsx
│   │   ├── AdminDonation.tsx
│   │   ├── AdminPrayerRequests.tsx
│   │   ├── AdminMessages.tsx
│   │   ├── AdminNewsletter.tsx
│   │   ├── AdminPages.tsx
│   │   ├── AdminFiles.tsx
│   │   └── AdminSettings.tsx
│   └── stores/
│       ├── adminAuthStore.ts     # Login session + credentials
│       └── adminDataStore.ts     # CRUD hooks, uploads, backups
├── data/
│   └── siteData.ts               # Types, defaults and storage helpers
├── lib/
│   └── videoFeeds.ts             # YouTube RSS/API + Facebook Graph fetching
└── hooks/
    ├── useSiteContent.ts         # Reactive reads used by the public site
    └── useVideoFeed.ts           # Auto-refreshing video feed for Sermons
```

Routes are registered in `src/App.tsx` under `/admin` and `/admin/login`.

---

## 8. Important notes

- This project is a **front-end only** application. The admin panel is a
  browser-based CMS backed by `localStorage`; there is no server or database.
- Video fetching is also browser-based. YouTube works through a public RSS feed
  and CORS proxy; Facebook needs a Page access token. Backups deliberately leave
  out the YouTube API key and Facebook token.
- Everything the admin changes is visible only in the browser where it was
  changed. Other visitors and devices will still see the built-in content.
- For a production multi-user setup, connect the data layer in
  `src/data/siteData.ts` to a real backend (e.g. Supabase, Firebase or a Node
  API) and replace the client-side login with server authentication.
- The default password is public in this file — change it before deploying.
