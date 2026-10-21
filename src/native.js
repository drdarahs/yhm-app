// Native bridge for the YHM Coach Android app.
// Bundled by esbuild into app-www/native.js and exposed as window.YHMNative,
// which the shared web code (www/index.html) uses when it runs inside the app.
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Health } from '@capgo/capacitor-health';

const READ = ['workouts', 'distance', 'heartRate', 'steps', 'weight'];
const CHANNEL = 'yhm-reminders';

if (Capacitor.isNativePlatform()) {
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

  window.YHMNative = {
    platform: Capacitor.getPlatform(),

    ready() {
      SplashScreen.hide().catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#1b4074' }).catch(() => {});
    },

    health: {
      available: () => Health.isAvailable(),
      connect: () => Health.requestAuthorization({ read: READ, write: [] }),
      settings: () => Health.openHealthConnectSettings(),
      privacy: () => Health.showPrivacyPolicy(),

      // Which read permissions are granted (no prompt).
      async granted() {
        const r = await Health.checkAuthorization({ read: READ, write: [] });
        return (r && r.readAuthorized) || [];
      },

      // Total distance (metres) recorded by any app between two times.
      async distanceBetween(startISO, endISO) {
        const { samples } = await Health.queryAggregated({ dataType: 'distance', startDate: startISO, endDate: endISO, bucket: 'day', aggregation: 'sum' });
        if (!samples || !samples.length) return 0;
        return samples.reduce((a, s) => a + (s.value || 0), 0);
      },

      // All workouts since `sinceISO`, following Health Connect page tokens.
      // The plugin computes workout distance together with calories, which this app
      // does not ask for, so a missing distance is filled in from distance records.
      async workouts(sinceISO) {
        const out = [];
        let anchor;
        for (let page = 0; page < 6; page++) {
          const res = await Health.queryWorkouts({
            startDate: sinceISO,
            endDate: new Date().toISOString(),
            limit: 100,
            ascending: true,
            ...(anchor ? { anchor } : {}),
          });
          out.push(...(res.workouts || []));
          anchor = res.anchor;
          if (!anchor) break;
        }
        for (const w of out) {
          if (!w.totalDistance) {
            try { w.totalDistance = await this.distanceBetween(w.startDate, w.endDate); } catch (e) { /* no distance permission */ }
          }
        }
        return out;
      },

      // Steps per day for the last `days` days: { 'YYYY-MM-DD': n }
      async stepsHistory(days) {
        const start = startOfToday(); start.setDate(start.getDate() - (days - 1));
        const { samples } = await Health.queryAggregated({
          dataType: 'steps', startDate: start.toISOString(), endDate: new Date().toISOString(), bucket: 'day', aggregation: 'sum',
        });
        const out = {};
        for (const s of samples || []) {
          const d = new Date(s.startDate);
          const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
          out[k] = (out[k] || 0) + Math.round(s.value || 0);
        }
        return out;
      },

      async avgHr(startISO, endISO) {
        const { samples } = await Health.readSamples({ dataType: 'heartRate', startDate: startISO, endDate: endISO, limit: 2000 });
        if (!samples || !samples.length) return null;
        return Math.round(samples.reduce((a, s) => a + s.value, 0) / samples.length);
      },

      async stepsToday() {
        const { samples } = await Health.queryAggregated({
          dataType: 'steps', startDate: startOfToday().toISOString(), endDate: new Date().toISOString(), bucket: 'day', aggregation: 'sum',
        });
        if (!samples || !samples.length) return null;
        return samples.reduce((a, s) => a + (s.value || 0), 0);
      },

      async latestWeight() {
        const since = new Date(Date.now() - 90 * 864e5).toISOString();
        const { samples } = await Health.readSamples({ dataType: 'weight', startDate: since, endDate: new Date().toISOString(), limit: 1, ascending: false });
        return samples && samples[0] ? samples[0].value : null;
      },
    },

    notify: {
      async permit(ask) {
        let p = await LocalNotifications.checkPermissions();
        if (p.display !== 'granted' && ask) p = await LocalNotifications.requestPermissions();
        if (p.display === 'granted') {
          await LocalNotifications.createChannel({
            id: CHANNEL, name: 'Training reminders', description: 'Daily training, water and sleep reminders',
            importance: 4, visibility: 1, vibration: true, lights: true, lightColor: '#1B4074',
          }).catch(() => {});
          return true;
        }
        return false;
      },

      // A test notification in about 5 seconds, without touching the scheduled ones.
      async test() {
        await LocalNotifications.schedule({ notifications: [{
          id: 9999, title: 'YHM Coach reminders are on ✅', body: 'You will get your training, water and tomorrow-plan reminders like this.',
          channelId: CHANNEL, smallIcon: 'ic_stat_yhm', iconColor: '#1B4074', schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true },
        }] });
      },

      async pending() {
        const { notifications } = await LocalNotifications.getPending();
        return notifications.length;
      },

      async clear() {
        const { notifications } = await LocalNotifications.getPending();
        if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map(n => ({ id: n.id })) });
      },

      // items: {id, title, body, at?: ISO string} or {id, title, body, hour, minute} for daily repeats
      async schedule(items) {
        await this.clear();
        const notifications = items.map(it => ({
          id: it.id,
          title: it.title,
          body: it.body,
          channelId: CHANNEL,
          isExactNotification: false,
          smallIcon: 'ic_stat_yhm',
          iconColor: '#1B4074',
          schedule: it.at
            ? { at: new Date(it.at), allowWhileIdle: true }
            : { on: { hour: it.hour, minute: it.minute }, repeats: true, allowWhileIdle: true },
        }));
        if (notifications.length) await LocalNotifications.schedule({ notifications });
      },
    },
  };

  // Tapping a reminder opens the Today screen.
  LocalNotifications.addListener('localNotificationActionPerformed', (a) => {
    const id = a && a.notification && a.notification.id;
    try { location.hash = id >= 3000 && id < 4000 ? '#tomorrow' : id >= 4000 && id < 5000 ? '#progress' : '#today'; } catch (e) { /* ignore */ }
  }).catch(() => {});

}
