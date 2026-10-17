# YHM 2027 Garmin watch face

A Connect IQ watch face for Yavatmal Health Marathon 2027 (Sunday, 3 January 2027).

**On the face:** official YHM logo, big time with an orange colon, date, an orange countdown ("78 DAYS TO YHM 2027", then "RACE DAY!", then "YHM 2027 FINISHER"), heart rate, steps, and battery. The outer ring fills in sky blue as you walk towards your daily step goal. AMOLED watches get a dim, low-pixel always-on mode.

**Watches:** about 60 round-screen Garmin models, including Forerunner 55–970, fēnix 6/7/8, epix, Enduro, Venu and vívoactive. The list is in `products.txt`; the build skips any model Garmin's SDK doesn't recognise.

`preview/` has pictures of the design; `faceit/` has two photo backgrounds for Garmin's Face It.

## Building (GitHub Actions)

The workflow `.github/workflows/build-watchface.yml` runs when anything in `watchface/` changes, or from **Actions → Build YHM watch face (Garmin) → Run workflow**.

It needs three repository secrets (**Settings → Secrets and variables → Actions**):

| Secret | What |
|---|---|
| `GARMIN_USERNAME` | email of a Garmin account (a separate one just for developing is best) |
| `GARMIN_PASSWORD` | its password. The account must **not** have two-step verification on. |
| `CIQ_DEVELOPER_KEY_BASE64` | the developer signing key Claude created (`developer-key-base64.txt`). The same key must sign every Store update. |

Garmin only lets signed-in developer accounts download its SDK and watch-model files, which is why the login is needed. The build accepts Garmin's Connect IQ SDK licence for that account.

**Output** (in a GitHub Release named "YHM 2027 watch face 1.0.N"):
- `YHM2027-watchface.iq`: upload to the Connect IQ Store
- `YHM2027-watchface-sideload.zip`: one `.prg` per watch, for testing over USB

## Testing on your own watch

1. Connect the watch to a computer with its USB cable.
2. Open the `GARMIN/APPS` folder on the watch and copy `YHM2027-<your model>.prg` into it.
3. Unplug the watch, then pick the face under **Watch face** settings.

## Publishing on the Connect IQ Store (free)

1. Sign in at https://apps.garmin.com/developer with the developer Garmin account.
2. **Upload an app** → choose `YHM2027-watchface.iq`.
3. Name: **YHM 2027**. Type: Watch Face. Add the description and the preview images from `preview/`.
4. Submit. Garmin reviews it, usually within a few days. After approval, runners install it from the **Connect IQ** app on their phone by searching "YHM 2027".

## Changing the design

- Code: `source/YHMView.mc`. Race date: `RACE_Y`, `RACE_M`, `RACE_D`.
- Logo and font sizes for each screen size: run `python3 watchface/tools/make_resources.py` (it also redraws `preview/`).
