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
      StatusBar.setBackgroundColor({ color: '#2a1694' }).catch(() => {});
    },

    health: {
      available: () => Health.isAvailable(),
      connect: () => Health.requestAuthorization({ read: READ, write: [] }),
      settings: () => Health.openHealthConnectSettings(),
      privacy: () => Health.showPrivacyPolicy(),

      // All workouts since `sinceISO`, following Health Connect page tokens.
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
            importance: 4, visibility: 1, vibration: true, lights: true, lightColor: '#5B3CF0',
          }).catch(() => {});
          return true;
        }
        return false;
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
          iconColor: '#5B3CF0',
          schedule: it.at
            ? { at: new Date(it.at), allowWhileIdle: true }
            : { on: { hour: it.hour, minute: it.minute }, allowWhileIdle: true },
        }));
        if (notifications.length) await LocalNotifications.schedule({ notifications });
      },
    },
  };

  // Tapping a reminder opens the Today screen.
  LocalNotifications.addListener('localNotificationActionPerformed', () => {
    try { location.hash = '#today'; } catch (e) { /* ignore */ }
  }).catch(() => {});
}
