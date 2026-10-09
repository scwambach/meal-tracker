# Meal Tracker

A phone-first web app that shows what you've eaten, with estimated calories and macros, and how much you have left for the day and the week. Meals are added by Claude through the companion MCP server, [meal-tracker-mcp](https://github.com/scwambach/meal-tracker-mcp), which you self-host.

Hosted on Netlify. Data lives in [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), so there's no database to set up. No photos are ever stored.

## What it does

- **Today**: a ring showing calories left today, macro progress, and a week card with calories left this week, plus a daily budget for the rest of the week. Swipe left or right to change days.
- **History**: every day you've logged, with how far it was over or under your goal.
- **Goals**: enter your sex, age, height, weight, activity level and how fast you want to lose. Your daily and weekly calorie and macro targets update live as you type.
- Tap any meal to see its item-by-item breakdown and the assumptions Claude made.

On iPhone, open the site in Safari and tap Share → **Add to Home Screen** so it runs full-screen like an app. On Android, use Chrome's menu → **Install app**.

### How goals are calculated

Your resting burn is estimated with the Mifflin–St Jeor equation, then multiplied by your activity level. Each pound per week you want to lose takes 500 kcal a day off that. The goal never goes below 1,500 kcal (male) or 1,200 kcal (female). Protein is set to about 1.8 g per kg of body weight (capped at 35% of calories), fat to 28% of calories, and carbs get the rest.

## Pieces

- `public/` is the app: static HTML, CSS and JS that read from the API.
- `netlify/functions/meals.mts` is the API.
  - `GET /api/meals?from=YYYY-MM-DD&to=YYYY-MM-DD` and `GET /api/meals/:id` are public.
  - `POST /api/meals`, `PATCH /api/meals/:id` and `DELETE /api/meals/:id` require `Authorization: Bearer $MEAL_API_TOKEN`.
  - `GET /api/profile` returns your profile and computed targets. `PUT /api/profile` accepts either `MEAL_API_TOKEN` or `SITE_PASSCODE`.
- `netlify/lib/meals.ts` holds the meal schema and storage. Totals are computed on the server from each meal's items.
- `netlify/lib/goals.ts` holds the profile schema and goal math.

## Deploy

1. Push this repo to GitHub and import it in Netlify (no build settings needed; `netlify.toml` covers them).
2. In **Site configuration → Environment variables**, set:
   - `MEAL_API_TOKEN`: a long random string, e.g. `openssl rand -hex 32`. Use the same value in meal-tracker-mcp.
   - `SITE_PASSCODE`: a short code you'll type once per device to save your goals.

## Local development

```bash
npm install
printf 'MEAL_API_TOKEN=dev\nSITE_PASSCODE=1234\n' > .env
npx netlify-cli dev
```

The site runs at http://localhost:8888, with Blobs in local sandbox mode.

## Privacy note

The meal log is readable by anyone who has the site URL. To make it private, turn on Netlify's password protection for the site, or ask for a login to be added.
