# Fadeout

A movie and TV discovery web app powered by [The Movie Database (TMDB)](https://www.themoviedb.org/). Browse what's trending, search across films and shows, and open detailed title pages with ratings, credits and trailers.

**Live site:** [fadeout.venture31.com](https://fadeout.venture31.com)

<!-- Add a screenshot here, e.g. ![Fadeout home page](assets/images/screenshot.png) -->

## Features

- **Trending movies and TV:** top titles of the day or week, with a toggle to switch between the two
- **Search:** search movies and TV shows together, with results as poster cards
- **Title details:** a lightbox panel with overview, runtime, genres, age rating, key cast and crew, and an embedded trailer
- **Watch for Free:** a curated section of titles with links to free viewing options
- **Secure API access:** the TMDB key never reaches the browser; all requests go through a small Node.js proxy on the server

### In progress

- AI-powered movie recommendations using generative AI
- An agentic search feature that can find titles from natural-language requests

## Tech stack

| Part | Built with |
|---|---|
| Front end | HTML, CSS, JavaScript (ES modules) |
| Data | TMDB API |
| API proxy | Node.js (built-in `http` module, no dependencies) |
| Hosting | cPanel with Git Version Control and the Node.js app manager |

## Project structure

```
Fadeout/
├── index.html          Home page: trending rows and Watch for Free
├── search.html         Search page
├── tvTrend.html        Extended trending lists
├── STW.html            S.T.W. page
├── css/                Stylesheets
├── js/                 Front-end scripts
│   ├── main.js         Loads the trending rows on the home page
│   ├── movies.js       Trending movies
│   ├── tv.js           Trending TV shows
│   ├── multiSearch.js  Combined movie and TV search
│   └── indexLightbox.js  Title details panel
├── assets/             Images, icons and Watch for Free data
├── server/
│   ├── app.js          TMDB proxy
│   └── package.json
└── .cpanel.yml         Deployment script
```

## How the API proxy works

Browser code can't keep an API key secret, so Fadeout never talks to TMDB directly. Instead:

1. The front end requests data from its own server, for example `/api/tmdb/trending/movie/day`.
2. The Node.js app in `server/app.js` receives the request, removes any `api_key` the browser sent, and checks the path against an allow-list (`/movie`, `/tv`, `/search`, `/trending` and a few others).
3. It forwards the request to TMDB, adding the key from the `TMDB_TOKEN` environment variable in an `Authorization` header.
4. It returns TMDB's response to the browser.

The key only exists in the server's environment. It is never in the repository or in anything a visitor downloads.

## Running locally

**Requirements:** Node.js 20.6 or newer, and a TMDB account.

1. Clone the repo:
   ```bash
   git clone https://github.com/archcoder-jd/Fadeout.git
   cd Fadeout
   ```
2. Get your **API Read Access Token** from your TMDB account under **Settings → API**. Use the long token that starts with `eyJ`, not the shorter API key.
3. Create a file named `.env` in the project folder:
   ```
   TMDB_TOKEN=your-read-access-token
   ```
   `.env` is listed in `.gitignore`, so it won't be committed.
4. Start the proxy:
   ```bash
   node --env-file=.env server/app.js
   ```
5. Check it's working by opening http://localhost:3000/tmdb/trending/movie/day. You should see movie data as JSON.

Stop the server with **Ctrl + C**.

> The front-end pages request `/api/tmdb/...` on the same domain, so opening them with a basic static server (such as VS Code's Live Server) won't load movie data locally. Use the live site to test the full app.

## Deployment

Fadeout is deployed with cPanel's Git Version Control. On each deploy, `.cpanel.yml`:

1. Copies the website files into the subdomain's folder
2. Copies `server/app.js` and `server/package.json` into the Node.js app folder
3. Restarts the Node.js app

**One-time setup in cPanel:**

1. Create the subdomain.
2. In the **Node.js** app manager, create an application with:
   - **Node.js version:** 18 or newer
   - **Application mode:** Production
   - **Application root:** `fadeout-api`
   - **Application URL:** the subdomain, with `api` as the path
   - **Application startup file:** `app.js`
   - **Environment variable:** `TMDB_TOKEN` set to your TMDB Read Access Token
3. In **Git Version Control**, clone this repository.

**To deploy an update:** push to GitHub, then in cPanel go to **Git Version Control → Manage → Pull or Deploy** and click **Update from Remote**, then **Deploy HEAD Commit**.

**Troubleshooting:** if `/api` returns a 503, the Node.js app failed to start. The reason is written to `stderr.log` in the app's folder.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.

Built by **Joseph Dennis** through [Venture31](https://www.venture31.com).

## License

Released under the [MIT License](LICENSE).