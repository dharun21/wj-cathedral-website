# Administrator guide

Open `/#/admin` and sign in with an account provisioned by the project owner.

## Publishing workflow

1. Open a module and add or edit a record.
2. Complete approved English and Tamil fields.
3. Preview and verify facts, dates, spelling, contact details and image consent.
4. Editors choose **Save Draft** or **Send for Approval**. Submitted records are locked from further editor changes.
5. The owner reviews pending content and chooses **Approve & Publish**.
6. Confirm the public page after the next data fetch.

Drafts, pending approvals and archived records are hidden from public visitors by database policy.

## Images

Use **Media Library → Upload private draft**. Files must be JPG, PNG, WebP or AVIF and at most 8 MB. The browser produces an optimized WebP up to 2400 px. Editors upload with meaningful English/Tamil alt text; the owner reviews and selects **Approve & publish**. Approved media can then be reused through **Choose from Media Library**.

Deletion is blocked while media is referenced. Use only church-owned or explicitly authorized images.

## Rules

- Carousel buttons accept approved internal hash destinations only.
- YouTube entries remain hosted by YouTube; watch, live, shorts, embed and `youtu.be` URLs are supported.
- Worship schedules require explicit church verification before publication.
- A 24/7 prayer claim appears only after confirmation in Website Settings.
- Event times display in Asia/Kolkata.
- Never enter prayer requests, health records or student personal information.
- Do not publish accreditation, impact totals, leadership/history or medical claims without approval.

Modules cover carousel slides, announcements, events, worship times, videos, ministries, bilingual page copy, albums, photos, media and website settings.
# Admissions administration

The **Administration → Admission Applications** page is visible only to owners. It lists every enquiry submitted through the public Academics form with its India Standard Time submission date, applicant details, course interest, ministry experience and study statement.

Owners can open an application, record private follow-up notes and move it through **New**, **Reviewing**, **Contacted** and **Closed**. Editors cannot see or query applicant records. Treat all applicant information as private, use it only for admissions follow-up and remove records according to the church-approved retention policy.

# Daily Bible verses

Open **Homepage → Daily Bible Verses** to manage the third homepage carousel slide.

- Add the approved English and Tamil verse text and both references.
- Record the Bible translation/version whenever possible.
- Leave **Special display date** empty to include the verse in automatic daily rotation.
- Set a date to override the normal rotation on that India date—for example Christmas or Easter.
- Editors save drafts and send them for approval; an owner publishes them.
- Only active, published verses can appear publicly.

The public website changes the selected verse at midnight in `Asia/Kolkata`. If there is no published verse, it shows a neutral “Today’s Bible verse” placeholder instead of inventing Scripture content.

# Team and access

Only the manually provisioned owner can open **Administration → Team & Access**.

1. Enter the editor's name, email address and a temporary password, then choose **Create account & grant access**.
2. Share the temporary password privately. Ask the editor to use **Forgot password** to choose a personal password after the first sign-in.
3. **Remove access** immediately disables CMS authorization but deliberately keeps the Supabase Auth user and membership record. The owner can restore that editor later.
4. **Restore access** works only while fewer than two editors have active access.
5. **Delete user permanently** removes the Supabase Auth user and cascades to the membership record. It cannot be undone.

At most two editors can be active at once. The screen displays the current capacity, and the PostgreSQL trigger enforces the same limit even if a request bypasses the interface. Owners cannot create, remove or delete another owner from this screen. Passwords are handled by Supabase Auth and are never stored in the website tables.

