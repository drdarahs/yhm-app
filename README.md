# YHM Coach: Android and iPhone app

Training app for Yavatmal Health Marathon 2027 runners. Organised by Cotton City Runners Foundation, Yavatmal.

**What runners get** (version 2)

- **Several runners on one phone**: each family member, student or club runner gets their own profile, plan, logs and progress. One runner is marked "this phone" and gets watch sync and reminders.
- Step-by-step setup: about you, goal (5/10/21/42 km), level, run days, recent 5 km time, health conditions, habits, diet, reminder time
- **Adaptive plans**: fewer than half of last week's sessions done → this week 15% lighter (25% after two light weeks); pain in a note or effort 9–10 → speed sessions become easy runs; faster runs → paces and predicted finish update
- **Daily tracking**: each day is marked done, partly done or missed by matching synced or logged activities to the plan; week strip on the Today screen
- **Progress screen**: distance, sessions done %, streak, active days, predicted finish, 5 km estimate, long-run readiness, weekly planned-vs-done chart, pace trend, 14-day steps, weight log
- **Health Connect sync** (Garmin Connect, Samsung Health, Fitbit, Strava, Google Fit, Mi Fitness, Zepp, COROS…) with distance, time, heart rate, steps and weight; runs on app open; sync details screen; in-app setup steps for each watch brand
- **Notifications**: today's workout (morning), tomorrow's plan with how to prepare (evening, default 8:30 pm), drink water every 1/2/3 h from 8 am to 8 pm, sleep, Sunday weekly summary, test button
- Nutrition by age, gender, weight, BMI, day's training, 13 conditions and 8 habits; Indian veg/egg/non-veg meals
- Race info, updates, registration at www.yavatmalhealthmarathon.com, race-day checklist, organiser contacts

Source: `src/v2/shell.html` (screens and styles), `src/v2/lib.js` (plan, nutrition, file parsers), `src/v2/app.js` (app logic). `npm run build:web` assembles them into `www/index.html`.

---

## Get the installable app (APK)

**Live now:** code is at https://github.com/drdarahs/yhm-app. Download the latest APK from https://github.com/drdarahs/yhm-app/releases/latest (first build: YHM Coach 1.0.1, 16 Oct 2026). Every change pushed to `main` builds a new release automatically.

The steps below are how it was set up, for reference.

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

The app reads race news from `docs/updates.json` in this repository (served at https://drdarahs.github.io/yhm-app/updates.json), then from `https://www.yavatmalhealthmarathon.com/updates.json`. To post news, edit `docs/updates.json` on GitHub (or ask Claude), in this format (newest first; `link` is optional):

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
2. Upload key: Claude created `yhm-coach-upload.keystore` (alias `yhm`). Keep the file and its password safe and private. Never put them in this repository.
3. In the GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**, add two secrets:
   - `YHM_KEYSTORE_BASE64`: the contents of `keystore-base64.txt`
   - `YHM_KEYSTORE_PASSWORD`: the contents of `password.txt`
4. The next build also produces `YHM-Coach-1.0.N.aab`. Upload that to Play Console.
5. Play Console will ask for:
   - **Privacy policy URL**: https://drdarahs.github.io/yhm-app/privacypolicy.html (served by GitHub Pages from `docs/`)
   - **Health Connect declaration**: the app reads Exercise, Distance, Heart rate, Steps and Weight to show training progress. It writes nothing.
   - **Data safety**: no data collected or shared; all data stays on the device.
   - **Store graphics**: `brand/play-icon.png` (512 × 512, official YHM logo) and `brand/play-feature-graphic.png` (1024 × 500)

---

---

## iPhone app (App Store)

- Project: `ios/` (Capacitor 8, Swift Package Manager). Bundle ID `com.yavatmalhealthmarathon.coach`, iPhone only, iOS 15+, HealthKit read-only (entitlement in `ios/App/App/App.entitlements`, usage text in `Info.plist`, privacy manifest `PrivacyInfo.xcprivacy`).
- Icon and launch screen: `python3 brand/make_ios_assets.py`.
- Cloud build: `.github/workflows/build-ios.yml` on a GitHub macOS 26 runner. Without secrets it checks the app compiles for the simulator. With `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID` and `ASC_KEY_P8` (App Store Connect API key, Admin) it signs automatically and uploads to App Store Connect / TestFlight.
- App version = `version` in `package.json`; build number = the workflow run number.
- Step-by-step store guide: the "YHM Coach: Play Store and App Store guide" doc.

---

## For developers

- Shared web app: `www/index.html` (same file powers the Claude-hosted page)
- Native bridge: `src/native.js` (Capacitor 8, `@capgo/capacitor-health`, `@capacitor/local-notifications`)
- Build the app's web folder: `npm run build:web` → `app-www/`
- Local build: `npm ci && npm run sync`, then open `android/` in Android Studio and press Run. iPhone: `npm run sync:ios`, then open `ios/App/App.xcodeproj` in Xcode on a Mac
- Brand art: official logos and stadium photo in `brand/source`; `python3 brand/make_assets.py` rebuilds the app icons, splash and store graphics
- `android/app/yhm-sideload.keystore` signs test APKs so updates install over each other. It is not the Play Store key.
- App ID: `com.yavatmalhealthmarathon.coach` · min Android 8.0 (API 26) · target API 36
