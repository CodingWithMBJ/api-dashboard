## Repo snapshot

- Small static frontend app (single HTML page) at `index.html`.
- Static assets under `assets/` (CSS in `assets/css/style.css`, JS in `assets/js/script.js`).
- `index.html` wires UI to global functions via inline `onclick` attributes (e.g. `getDogImage()`, `getCatImage()`, `getWeather()`).

## Big-picture architecture (quick)

- Single-page static UI that fetches data from public APIs and renders responses into output containers.
- UI elements are organized into sections in `index.html` (each section has a button that calls a global JS function and an `.output` div where results are injected). Example IDs: `dog-output`, `cat-output`, `weather-output`, `currency-output`, `movies-output`, `github-output`, `joke-output`, `publicapi-output`.
- All JavaScript should live in `assets/js/script.js` and expose global functions matching the `onclick` names from `index.html`.

## Key patterns and constraints for code suggestions

- Use DOM IDs from `index.html` when locating output containers (e.g. `document.getElementById('dog-output')`). Do not invent new IDs without updating HTML.
- `index.html` references assets using absolute paths (`/assets/...`). Advise the developer to run a local static server (see "Developer workflows") rather than relying on `file://` paths; otherwise asset resolution will break.
- Keep functions simple and idempotent: each button handler should fetch its API and populate its corresponding `.output` container. Example handler contract:
  - Input: none (button click).
  - Side effect: writes HTML into a named output div (example: `dog-output`).
  - Error mode: write a short error message into the same output div.

## Developer workflows (explicit)

- No build system present. To preview locally, run a static server from the repo root.

  Python 3 built-in server (macOS):

  ```bash
  cd /Users/codingwithmbj/Desktop/Coding-Temple/JS/api-dashboard
  python3 -m http.server 8000
  # then open http://localhost:8000/index.html
  ```

- Recommended VS Code convenience: use the "Live Server" extension or the built-in debug profile that serves the workspace root.

## Examples from this repo to reference in edits

- Buttons in `index.html`:
  - `<button onclick="getDogImage()">Get Dog</button>` — map this to a `getDogImage` function in `assets/js/script.js` that fetches a dog image and appends an `<img>` into `#dog-output`.
  - Each section follows the same pattern: `button` triggers global function; `div.output` is the target.

- Styling: `assets/css/style.css` is small and controls grid layout. Avoid altering class names used in HTML unless updating markup and styles in lockstep.

## Integration points & external dependencies

- External APIs: the app is designed to call public APIs (dogs, cats, weather, currency, movies, GitHub, jokes, public-apis). When suggesting code, use fetch-based examples and include simple error handling and basic JSON parsing.
- No package manager or CI is present in the repo; do not add dependency-focused instructions unless the project is migrated to a build tool.

## Safety & small conventions

- Keep functions in `assets/js/script.js` and avoid putting large amounts of inline JS in `index.html`.
- Use the existing CSS class names (`grid-container`, `grid-item`, `output`) when producing markup suggestions so styling remains consistent.

## When you need clarification

- If a change adds or renames an ID or class referenced from `index.html`, update both the HTML and `assets/css/style.css` or `assets/js/script.js` in the same commit.
- If suggested network requests require API keys (e.g., weather or movies), list the environment/key requirement and leave a placeholder in code rather than embedding secrets.

---
If you'd like, I can implement one example handler (e.g. `getDogImage`) in `assets/js/script.js` and verify the page loads via the local static server. Tell me which handler to implement first or say "implement an example" and I'll add it and run a quick verification step.
