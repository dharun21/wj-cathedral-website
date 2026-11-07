# Deployment — postponed

No public deployment, merge to `main`, force-push, domain purchase or hosting change is part of this phase. Development remains on the existing `development` branch. A database-backed preview requires the owner’s Supabase project and public environment values.

## Local production preview

```bash
npm install
npm run build
npm run preview
```

Vite writes the static output to `dist/`. The configuration uses `base: './'`, so assets work from a GitHub project path and a future custom domain.

## Future deployment checklist

After client approval and domain confirmation:

1. Finish every item in `CONTENT_CHECKLIST.md`.
2. Replace `wjcathedral.example` in `public/robots.txt` and `public/sitemap.xml`.
3. Add the production canonical URL, `og:url`, and an absolute Open Graph image URL in `index.html`.
4. Re-run typecheck, lint, build and browser accessibility/responsive checks.
5. Initialize Git only in this project folder, create a private/approved remote and review all tracked files.
6. Add the chosen hosting workflow (GitHub Pages or Cloudflare Pages) in that later phase.
7. Configure HTTPS and the custom domain at the host; no secrets should be required for this static site.
8. Test the final public URL, both languages, social previews, sitemap, robots file, phone link, Maps link and YouTube playback.

For GitHub Pages, use the official static Pages action after the account is available. For Cloudflare Pages, set the build command to `npm run build` and output directory to `dist`. Do not activate either until the client explicitly approves deployment.

