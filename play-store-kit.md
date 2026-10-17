# YHM Coach: Google Play Store kit

Everything to copy into Play Console for YHM Coach. Prepared 16 October 2026.

- **App ID (package name):** `com.yavatmalhealthmarathon.coach`
- **Upload file:** `YHM-Coach-1.0.N.aab` from https://github.com/drdarahs/yhm-app/releases/latest (appears after the two GitHub secrets are added)

---

## Step 1: Add the upload key to GitHub (one time)

On github.com, open **drdarahs/yhm-app → Settings → Secrets and variables → Actions → New repository secret**. Add:

| Name | Value |
|---|---|
| `YHM_KEYSTORE_BASE64` | the whole contents of `keystore-base64.txt` (one long line) |
| `YHM_KEYSTORE_PASSWORD` | the contents of `password.txt` |

Then open **Actions → Build YHM Coach app → Run workflow**. About 10 minutes later the release has both an `.apk` and an `.aab`.

Keep `yhm-coach-upload.keystore` and `password.txt` somewhere safe and private, for example Google Drive plus a pen drive. Don't share them. If they're lost, Google support can reset the upload key, but it takes days.

---

## Step 2: Put the privacy policy online

Upload `privacypolicy.html` to the root of the Cloudflare site, the same way you upload the other site files. Check that it opens at:

**https://www.yavatmalhealthmarathon.com/privacypolicy.html**

---

## Step 3: Create the app in Play Console

Play Console → **Create app**

- App name: **YHM Coach**
- Default language: **English (United Kingdom) – en-GB**
- App or game: **App**
- Free or paid: **Free**
- Accept the declarations → **Create app**

---

## Step 4: Store listing (Grow → Store presence → Main store listing)

**App name** (max 30 characters)
> YHM Coach

**Short description** (max 80 characters)
> Training plans, nutrition and reminders for Yavatmal Health Marathon runners

**Full description**
> YHM Coach is the official training app of the Yavatmal Health Marathon 2027, organised by Cotton City Runners Foundation. Get ready for race day on Sunday, 3 January 2027 at Nehru Stadium, Yavatmal.
>
> RUNNING COACH
> • Week-by-week plans for 5 km, 10 km, 21 km (half marathon) and 42 km (marathon)
> • Built from your age, current running, run days per week and a recent 5 km time
> • Easy runs, intervals, tempo, hill repeats, long runs, taper and race week
> • Your own pace and heart-rate zones, plus a predicted finish time
>
> FITNESS COACH
> • Runner strength circuit and yoga / mobility days, no equipment needed
> • Adjusted for knee or back pain, beginners and runners over 60
>
> NUTRITION COACH
> • Daily calories, carbs, protein and water based on your age, gender, weight and that day's training
> • Indian veg, egg and non-veg meal ideas: poha, bhakri, dal, curd, chana and more
> • Advice for diabetes, high BP, thyroid, asthma, heart and kidney conditions, PCOS, anaemia and joint pain
> • Tips for habits like smoking, tobacco, alcohol, night shifts and short sleep
> • Race-day fuelling for every distance
>
> SYNC YOUR WATCH
> • Runs, walks and workouts come in automatically through Health Connect, from Garmin Connect, Samsung Health, Fitbit, Strava, Google Fit, Mi Fitness, Zepp, COROS and more
> • Distance, time, heart rate and daily steps in one place
> • Or import GPX, TCX and CSV files
>
> DAILY REMINDERS
> • Morning reminder with that day's session
> • Water, food and sleep reminders
> • Daily checklist and water tracker
>
> RACE INFO
> • Countdown, race categories, race-day checklist, updates and organiser contacts
>
> Your data stays on your phone. YHM Coach has no ads and doesn't sell or share your data.
>
> YHM Coach gives general training and nutrition guidance. It is not a medical service. Check with your doctor before starting a new exercise plan, especially if you have a health condition.

**Marathi translation** (Store listing → Manage translations → Add your own translation → Marathi – mr-IN)

Short description:
> यवतमाळ हेल्थ मॅरेथॉन धावपटूंसाठी प्रशिक्षण योजना, आहार सल्ला आणि दैनिक स्मरणपत्रे

Full description:
> YHM Coach हे यवतमाळ हेल्थ मॅरेथॉन 2027 चे अधिकृत प्रशिक्षण ॲप आहे. आयोजक: कॉटन सिटी रनर्स फाउंडेशन. रविवार, 3 जानेवारी 2027 रोजी नेहरू स्टेडियम, यवतमाळ येथे होणाऱ्या शर्यतीसाठी तयारी करा.
>
> रनिंग कोच
> • 5 किमी, 10 किमी, 21 किमी (हाफ मॅरेथॉन) आणि 42 किमी (मॅरेथॉन) साठी आठवड्यानुसार योजना
> • तुमचे वय, सध्याचे धावणे, आठवड्यातील दिवस आणि अलीकडील 5 किमी वेळेवर आधारित
> • तुमचा स्वतःचा वेग, हृदयगती झोन आणि अपेक्षित फिनिश वेळ
>
> फिटनेस कोच
> • धावपटूंसाठी स्ट्रेंथ व्यायाम आणि योग / मोबिलिटी, कोणतेही साहित्य न लागता
>
> आहार सल्ला
> • तुमचे वय, लिंग, वजन आणि त्या दिवसाच्या व्यायामानुसार कॅलरी, कार्ब्स, प्रोटीन आणि पाणी
> • शाकाहारी, अंडी आणि मांसाहारी भारतीय जेवणाचे पर्याय
> • मधुमेह, उच्च रक्तदाब, थायरॉईड, दमा, हृदय व किडनी आजार, PCOS, ॲनिमिया आणि सांधेदुखीसाठी सल्ला
>
> घड्याळ सिंक करा
> • Health Connect द्वारे Garmin Connect, Samsung Health, Fitbit, Strava, Google Fit आणि इतर ॲप्समधून धावण्याची नोंद आपोआप येते
>
> दैनिक स्मरणपत्रे
> • सकाळी त्या दिवसाचा व्यायाम, पाणी, जेवण आणि झोपेची स्मरणपत्रे
>
> तुमची माहिती तुमच्या फोनमध्येच राहते. जाहिराती नाहीत.
>
> YHM Coach सामान्य प्रशिक्षण व आहार मार्गदर्शन देते; हे वैद्यकीय सेवा नाही. नवीन व्यायाम सुरू करण्यापूर्वी डॉक्टरांचा सल्ला घ्या.

**Graphics**

| Field | File |
|---|---|
| App icon (512 × 512) | `play-icon.png` |
| Feature graphic (1024 × 500) | `play-feature-graphic.png` |
| Phone screenshots (2–8) | `1-today.png`, `2-plan.png`, `3-fuel.png`, `4-log.png`, `5-race.png` |

**Contact details**
- Email: yavatmalhealthmarathon@gmail.com
- Phone: +91 9225183880
- Website: https://www.yavatmalhealthmarathon.com

**Category:** Health & Fitness
**Tags:** Running, Fitness tracking, Workout

---

## Step 5: App content (Policy → App content)

**Privacy policy**
> https://www.yavatmalhealthmarathon.com/privacypolicy.html

**App access**
> All functionality is available without special access (no login).

**Ads**
> No, my app does not contain ads.

**Content rating** (questionnaire)
- Category: **All other app types** (not a game)
- Answer **No** to violence, sexual content, language, controlled substances, gambling, user-generated content, sharing location and buying digital goods
- Users can interact or exchange content: **No**
- Result is usually "Everyone" / 3+

**Target audience and content**
- Target age groups: **18 and over**. Choosing only adult ages avoids the extra Families policy requirements. Children's Run families use the parent's phone.
- Appeal to children: **No**

**News app:** No
**Government app:** No
**Financial features:** My app doesn't provide any financial features

**Health apps declaration**
- Health features: tick **Activity and fitness** and **Nutrition and weight management**.
- Health Connect data types and justifications:

| Data type | Why the app needs it (paste) |
|---|---|
| Exercise | Reads the user's runs, walks and workouts recorded by their watch or fitness app, so completed sessions appear in their YHM training log and count toward their weekly plan. |
| Distance | Shows the distance of each run and the weekly distance completed against the training plan. |
| Heart rate | Shows the average heart rate of each workout so the user can check they trained in the easy and tempo heart-rate zones the plan prescribes. |
| Steps | Shows today's step count on the home screen as a daily activity goal. |
| Weight | Keeps the user's daily calorie, protein and water targets accurate as their body weight changes during training. |

- Write access: **none**. The app only reads.
- Medical device / regulated: **No**. It gives general fitness and nutrition guidance.

**Data safety**
- Does your app collect or share any of the required user data types? **No**
  - Health Connect data and the profile the user types in are processed only on the device and never sent to a server. Google's rules don't count on-device-only processing as "collected".
- Is all user data encrypted in transit? **Not applicable** (no data is transmitted). If asked, choose Yes.
- Can users request data deletion? **Yes**: "Clear my data" in the app profile, or uninstall.

---

## Step 6: Closed test with 12 testers for 14 days

Only needed if Play Console shows **Production** as locked for this app. It applies to personal accounts created after 13 November 2023. If your Durgai EMR app already went through it, Play Console will tell you whether YHM Coach needs it too.

1. **Testing → Closed testing → Create track** (name it "CCRF runners")
2. **Testers → Create email list**: add 15–20 runners' Gmail addresses. Ask for more than 12 in case some drop out.
3. **Create new release** → upload the `.aab` → Release name `1.0.N` → **Save → Review → Start rollout**
4. Copy the **opt-in link** and send it with the message below.
5. All 12+ testers must stay opted in for 14 days in a row. Keep the app installed.
6. After 14 days: **Dashboard → Apply for production**, answer the short questions about your test, and wait for review (usually a few days).

**WhatsApp message for testers**

> 🏃 YHM Coach – please help test our official Yavatmal Health Marathon training app!
>
> 1. Open this link on your Android phone, signed in with the Gmail I added: <OPT-IN LINK>
> 2. Tap "Become a tester", then "Download it on Google Play"
> 3. Install YHM Coach and keep it installed for at least 14 days. Please open it a few times a week.
>
> It gives you a training plan, food guidance and reminders for 3 January. Thank you! – Cotton City Runners Foundation
>
> 🏃 YHM Coach – आपल्या यवतमाळ हेल्थ मॅरेथॉनच्या प्रशिक्षण ॲपची चाचणी करण्यासाठी मदत करा!
> 1. मी जोडलेल्या Gmail ने Android फोनवर ही लिंक उघडा: <OPT-IN LINK>
> 2. "Become a tester" वर टॅप करा, नंतर "Download it on Google Play"
> 3. YHM Coach इन्स्टॉल करा आणि किमान 14 दिवस ठेवा. आठवड्यातून काही वेळा उघडा.
> धन्यवाद! – कॉटन सिटी रनर्स फाउंडेशन

---

## Timeline to race day

| When | What |
|---|---|
| This week | Secrets in GitHub, privacy page online, app created, forms filled, closed test started |
| +14 days (about 1 November) | Apply for production |
| +3–7 days | Approved; YHM Coach is public on the Play Store |
| Until then | Runners install from https://github.com/drdarahs/yhm-app/releases/latest |

**Developer name:** the listing shows your Play account's developer name (the same one as your Durgai EMR app). To show "Cotton City Runners Foundation" instead, change it in Play Console → Settings → Developer account → Account details. That changes it for all your apps.
