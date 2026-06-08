## LinkedIn-style Posts Section

Build a dedicated `/posts` page that mirrors LinkedIn's feed UX and a full admin CMS to create/edit/delete posts. Media (photos + certificate scans) live on **your AWS S3 bucket**; metadata lives in Lovable Cloud (Supabase) for fast filtering and pagination.

### 1. Infrastructure setup

**a. AWS S3 connector** — I'll trigger the Lovable connector flow. You'll:
- Pick/create the connection with `write` scope enabled
- In AWS Console, add a CORS rule on your bucket so the browser can upload/download directly:
  ```json
  [{"AllowedOrigins":["https://*.lovable.app","https://yourdomain.com"],
    "AllowedMethods":["GET","PUT","HEAD"],
    "AllowedHeaders":["*"],"ExposeHeaders":["ETag"]}]
  ```

**b. Lovable Cloud** (already enabled) — adds two tables:
- `posts` — id, title, caption, type (`photo` | `certificate` | `project` | `event`), tags[], issuer, issue_date, credential_url, credential_id, created_at, published
- `post_media` — id, post_id, s3_key, width, height, blurhash, order, mime, size

**c. Edge function** `s3-sign` — issues short-lived signed URLs (read+write) via the connector gateway. Browser never sees AWS keys. Reuses existing pattern from cloud docs.

### 2. Public `/posts` page (LinkedIn-style)

- Vertical feed, max-width ~640px, card per post
- Header: avatar + name + post type chip + relative date
- Body: caption (with "see more" truncation), tag pills
- Media: 1 image → full-bleed; 2–4 → grid; 5+ → 2x2 + "+N" overlay. Click → lightbox with swipe + keyboard nav
- Certificate posts show issuer / date / "View credential" button
- Like & share buttons (like count stored locally for now — can wire to DB later)
- Sticky filter bar: All / Photos / Certificates / Projects / Events + tag search

### 3. Performance (the "fast but smooth" part)

| Concern | Approach |
|---|---|
| Initial payload | Paginated query (10 posts/page), infinite scroll via IntersectionObserver |
| Image weight | Upload original → edge function returns signed PUT URL. On client, downscale + convert to WebP with `browser-image-compression` before upload (max 1920px, ~80% quality). Certificates kept at higher quality. |
| LCP | First post's hero image gets `fetchpriority="high"` + preloaded signed URL |
| Lazy loading | `loading="lazy"` + `decoding="async"` on all below-fold images |
| Placeholders | Generate blurhash on upload, render as tiny CSS gradient until image decodes (no layout shift; width/height stored) |
| Caching | Signed GET URLs cached 50min in memory (TTL 60min). Same image reused across renders. |
| Bundle | Lightbox loaded via `lazy()` only when opened |
| Smooth feel | Framer Motion fade+slide on card mount; existing Lenis smooth scroll continues to work |

### 4. Admin: `/admin/posts`

- List view: table with type, title, date, published toggle, edit, delete
- Editor drawer: title, caption (textarea), type, tags (chip input), conditional certificate fields (issuer, date, credential URL/ID)
- Media uploader: drag-drop multi-file, shows compression + upload progress per file, reorder via drag handle, remove
- "Publish" toggle controls public visibility
- Adds `Posts` item to admin sidebar (icon: `Newspaper`)

### 5. Navigation

- Add `Posts` link to public `Navbar` (between Work and Blog)
- Add `/posts` route in `App.tsx`
- Keep admin link out of public navbar (existing rule)

### Technical details

**New files**
- `src/pages/PostsPage.tsx` — feed
- `src/components/posts/PostCard.tsx`, `MediaGallery.tsx`, `Lightbox.tsx`, `FilterBar.tsx`
- `src/pages/admin/PostsPage.tsx` + `PostEditor.tsx`
- `src/hooks/usePosts.ts` (pagination), `useSignedUrl.ts` (cached signer)
- `src/lib/imageCompress.ts`, `src/lib/blurhash.ts`
- `supabase/functions/s3-sign/index.ts` — POST `{op:"read"|"write", key}` → signed URL

**DB migration**: creates `posts` + `post_media` with RLS (public read where `published=true`; authenticated full access), GRANTs to `anon`/`authenticated`/`service_role`.

**Deps to add**: `browser-image-compression`, `blurhash`, `react-intersection-observer`.

### Out of scope (ask if you want them)
- Comments / real likes persisted to DB
- Multi-user feed (this is your personal portfolio feed)
- Video uploads

### Step order
1. Trigger S3 connector link (you'll click through)
2. Migration for tables + RLS
3. Edge function `s3-sign`
4. Admin Posts page + editor
5. Public `/posts` page + navbar link
6. Verify upload → display end-to-end
