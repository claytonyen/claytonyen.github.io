# Portfolio Site

## Files

- `index.html` — page structure (don't edit much)
- `style.css` — all styling. Colors, fonts, and spacing are set as CSS
  variables at the top of the file under `:root`.
- `script.js` — content, everything on the page (name, bio, jobs, projects, skills, links) is
  defined in a few plain JavaScript objects at the top of this file, then rendered into the page
  automatically.

## Editing content

Objects found in `script.js`:

- `PROFILE` — name, role, tagline, résumé link, email, GitHub, LinkedIn.
- `ABOUT` — bio paragraph and the quick-facts list.
- `EXPERIENCE` — an array of jobs. Copy an existing entry and edit the
  fields to add another one; most recent should go first.
- `PROJECTS` — an array of projects. Same idea — copy, paste, edit. Leave
  `liveUrl` or `repoUrl` as `""` to hide that link on a card, and set
  `featured: true` to add the "FEATURED" ribbon.
- `SKILLS` — grouped lists of tools/technologies.

### Adding résumé

Drop a `resume.pdf` file next to `index.html`, or change `resumeUrl` in
`PROFILE` to point anywhere else (e.g. a Google Drive link).

### Changing colors or fonts

Open `style.css` and edit the variables at the top under `:root`:

```css
:root {
  --paper: #EEF1EE;   /* background */
  --ink:   #141A1F;   /* main text */
  --blue:  #2C5F8A;   /* accent / links */
  --amber: #D98E32;   /* highlight, used sparingly */
  --navy:  #101826;   /* footer background */
  ...
}
```

Fonts are loaded from Google Fonts in `index.html`'s `<head>` — swap the
`<link>` there and the `--f-display` / `--f-body` / `--f-mono` variables
in `style.css` if you want different typefaces.

## Notes

- The layout is fully responsive and works down to small phone widths.
- Scroll-in animations respect `prefers-reduced-motion`.
- No build tools, no dependencies to install — just open `index.html` in
  a browser to preview locally, or use an extension like VS Code's "Live
  Server" for auto-reload while editing.
