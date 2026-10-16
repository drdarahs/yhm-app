# YHM Coach: Android app

Training app for Yavatmal Health Marathon 2027 runners. Organised by Cotton City Runners Foundation, Yavatmal.

**What runners get**

- 5, 10, 21 and 42 km training plans built from age, level, run days and a recent 5 km time, with paces and heart-rate zones
- Fitness coach: runner strength circuit and yoga/mobility days, adjusted for knee and back pain
- Nutrition coach: daily calories, carbs, protein and water from age, gender, weight and that day's training; Indian veg, egg and non-veg meals; advice for 13 health conditions and 8 habits
- **Health Connect sync**: runs, walks and workouts come in automatically from Garmin Connect, Samsung Health, Fitbit, Strava, Google Fit, Mi Fitness, Zepp, COROS and other apps that share to Health Connect, with distance, time, heart rate and today's steps
- **Phone notifications**: morning training reminder with that day's session, water and food reminders (10 am, 1 pm, 4:30 pm), sleep reminder (10 pm). Work offline.
- Daily checklist, water tracker, progress rings, weekly chart, race info, race-day checklist, organiser contacts
- Works fully offline; all data stays on the phone

---

## Get the installable app (APK)

The app is built in the cloud by GitHub, for free. You do this once; after that every change rebuilds automatically.

### Easiest: let Claude upload it

1. Sign up at **github.com** (free).
2. Tap **+ → New repository**, name it `yhm-coach`, choose **Private**, tap **Create repository**.
3. In Claude, open **Settings → Connectors** and connect **GitHub**.
4. Tell Claude in the *YHM Training App* project: "GitHub is connected, repo is `<your-username>/yhm-coach`". Claude uploads the project and starts the build.

### Or upload it yourself (on a computer)

1. Create the `yhm-coach` repository as above.
2. Unzip `yhm-coach-android.zip`. Turn on "show hidden files" so you can see the `.github` folder.
3. On the repository page tap **uploading an existing file**, drag in **everything** from the unzipped folder (including `.github`), then **Commit changes**.

### Download and install

1. Open the **Actions** tab. The build takes about 8–10 minutes; wait for the green tick.
2. Open **Releases** (right side of the repository page) → **YHM Coach 1.0.N**.
3. On your Android phone, download `YHM-Coach-1.0.N.apk` and open it. Allow **Install unknown apps** when asked.
4. Share the same APK file on WhatsApp with runners to install.

Each new build installs over the old one, and runners keep their plan and logs.

---

## Posting race updates

The app reads race news from `https://www.yavatmalhealthmarathon.com/updates.json`. To post news, upload a file named `updates.json` to the root of the website on Cloudflare, in this format (newest first):

```json
[
  { "date": "2026-12-20", "title": "Bib collection", "body": "Collect your bib at Nehru Stadium on 2 January, 10 am to 7 pm." },
  { "date": "2026-10-15", "title": "Early-bird registration is open", "body": "25% off till 30 November 2026." }
]
```

If the file isn't there, the app shows the updates built into it.

---

## Publishing on Google Play (later)

1. Create a Google Play Console developer account (one-time USD 25 fee).
2. Make an upload key on a computer with Java:
   `keytool -genkeypair -v -keystore upload.keystore -alias yhm -keyalg RSA -keysize 2048 -validity 10000`
   Keep this file and its password safe. Losing it means you can't update the app.
3. In the GitHub repository: **Settings → Secrets and variables → Actions**, add:
   - `YHM_KEYSTORE_BASE64`: the keystore file in base64 (`base64 -w0 upload.keystore`)
   - `YHM_KEYSTORE_PASSWORD`, `YHM_KEY_ALIAS` (`yhm`), `YHM_KEY_PASSWORD`
4. The next build also produces `YHM-Coach-1.0.N.aab`. Upload that to Play Console.
5. Play Console will ask for:
   - **Privacy policy URL**: upload `app/privacypolicy.html` to the website, e.g. `yavatmalhealthmarathon.com/privacypolicy.html`
   - **Health Connect declaration**: the app reads Exercise, Distance, Heart rate, Steps and Weight to show training progress. It writes nothing.
   - **Data safety**: no data collected or shared; all data stays on the device.
   - **Store graphics**: `brand/play-icon.png` (512 × 512) and `brand/play-feature-graphic.png` (1024 × 500)

---

## For developers

- Shared web app: `www/index.html` (same file powers the Claude-hosted page)
- Native bridge: `src/native.js` (Capacitor 8, `@capgo/capacitor-health`, `@capacitor/local-notifications`)
- Build the app's web folder: `npm run build:web` → `app-www/`
- Local build: `npm ci && npm run sync`, then open `android/` in Android Studio and press Run
- Brand art: `brand/render.py` renders icons, splash and store graphics from SVG
- `android/app/yhm-sideload.keystore` signs test APKs so updates install over each other. It is not the Play Store key.
- App ID: `com.yavatmalhealthmarathon.coach` · min Android 8.0 (API 26) · target API 36
