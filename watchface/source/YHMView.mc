// Draws the YHM 2027 face. Layout fractions match tools/make_resources.py
// (which renders the preview images), so change both together.
import Toybox.Activity;
import Toybox.ActivityMonitor;
import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.Time;
import Toybox.Time.Gregorian;
import Toybox.WatchUi;

class YHMView extends WatchUi.WatchFace {

    // Race day: Sunday 3 January 2027
    const RACE_Y = 2027;
    const RACE_M = 1;
    const RACE_D = 3;

    // Brand colours (navy brightened so it reads on a black screen)
    const NAVY = 0x2E64B4;
    const ORANGE = 0xEF7E14;
    const SKY = 0x01A0E2;
    const TRACK = 0x404040;
    const GREY = 0xB4B4B4;
    const DIM = 0x8C8C8C;
    const RED = 0xE6283C;
    const GREEN = 0x3CC878;

    // Layout, as fractions of screen width
    const CHIP_TOP = 0.095;
    const TIME_Y = 0.465;
    const DATE_Y = 0.645;
    const COUNT_Y = 0.725;
    const ROW_Y = 0.815;
    const TIME_CAP_CENTRE = 0.539; // digit centre within the time font's line height

    hidden var _logo;
    hidden var _timeFont;
    hidden var _sleeping = false;
    hidden var _burnIn = false;

    function initialize() {
        WatchFace.initialize();
        var s = System.getDeviceSettings();
        if (s has :requiresBurnInProtection) {
            _burnIn = s.requiresBurnInProtection;
        }
    }

    function onLayout(dc) {
        _logo = WatchUi.loadResource(Rez.Drawables.Logo);
        _timeFont = WatchUi.loadResource(Rez.Fonts.TimeFont);
    }

    function onShow() {
    }

    function onHide() {
    }

    function onEnterSleep() {
        _sleeping = true;
        WatchUi.requestUpdate();
    }

    function onExitSleep() {
        _sleeping = false;
        WatchUi.requestUpdate();
    }

    function onUpdate(dc) {
        var w = dc.getWidth();
        var h = dc.getHeight();
        var cx = w / 2;
        var cy = h / 2;

        dc.setColor(Graphics.COLOR_BLACK, Graphics.COLOR_BLACK);
        dc.clear();
        if (dc has :setAntiAlias) {
            dc.setAntiAlias(true);
        }

        var clock = System.getClockTime();
        var hour = clock.hour;
        var hh;
        if (System.getDeviceSettings().is24Hour) {
            hh = hour.format("%02d");
        } else {
            hour = hour % 12;
            if (hour == 0) {
                hour = 12;
            }
            hh = hour.format("%d");
        }
        var mm = clock.min.format("%02d");
        var days = daysToRace();

        // Always-on mode on AMOLED screens: few lit pixels, no logo or ring
        if (_sleeping && _burnIn) {
            dc.setColor(GREY, Graphics.COLOR_TRANSPARENT);
            dc.drawText(cx, cy - h * 0.04, Graphics.FONT_NUMBER_MEDIUM, hh + ":" + mm,
                Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);
            dc.setColor(0x96501E, Graphics.COLOR_TRANSPARENT);
            dc.drawText(cx, cy + h * 0.16, Graphics.FONT_XTINY, shortMessage(days),
                Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);
            return;
        }

        // Outer ring: steps progress towards today's goal
        var pen = (w * 0.022).toNumber();
        if (pen < 4) {
            pen = 4;
        }
        var r = cx - pen / 2 - 1;
        dc.setPenWidth(pen);
        dc.setColor(TRACK, Graphics.COLOR_TRANSPARENT);
        dc.drawCircle(cx, cy, r);
        var steps = 0;
        var goal = 0;
        var am = ActivityMonitor.getInfo();
        if (am != null) {
            if (am.steps != null) {
                steps = am.steps;
            }
            if (am.stepGoal != null) {
                goal = am.stepGoal;
            }
        }
        if (goal > 0 && steps > 0) {
            dc.setColor(SKY, Graphics.COLOR_TRANSPARENT);
            if (steps >= goal) {
                dc.drawCircle(cx, cy, r);
            } else {
                var sweep = (360 * steps / goal).toNumber();
                if (sweep > 0) {
                    var endDeg = 90 - sweep;
                    if (endDeg < 0) {
                        endDeg += 360;
                    }
                    dc.drawArc(cx, cy, r, Graphics.ARC_CLOCKWISE, 90, endDeg);
                }
            }
        }
        dc.setPenWidth(1);

        // Official YHM logo on a white badge
        var ly = (w * CHIP_TOP).toNumber();
        dc.drawBitmap(cx - _logo.getWidth() / 2, ly, _logo);

        // Navy / orange / sky stripe
        var sy = ly + _logo.getHeight() + (w * 0.022).toNumber();
        var sw = (w * 0.21).toNumber();
        var sh = (w * 0.012).toNumber();
        if (sh < 2) {
            sh = 2;
        }
        var seg = sw / 3;
        var sx = cx - sw / 2;
        dc.setColor(NAVY, Graphics.COLOR_TRANSPARENT);
        dc.fillRectangle(sx, sy, seg - 1, sh);
        dc.setColor(ORANGE, Graphics.COLOR_TRANSPARENT);
        dc.fillRectangle(sx + seg, sy, seg - 1, sh);
        dc.setColor(SKY, Graphics.COLOR_TRANSPARENT);
        dc.fillRectangle(sx + 2 * seg, sy, seg, sh);

        // Time: hours white, orange colon, minutes white
        var fh = dc.getFontHeight(_timeFont);
        var ty = (w * TIME_Y - fh * TIME_CAP_CENTRE).toNumber();
        var wh = dc.getTextWidthInPixels(hh, _timeFont);
        var wc = dc.getTextWidthInPixels(":", _timeFont);
        var wm = dc.getTextWidthInPixels(mm, _timeFont);
        var tx = cx - (wh + wc + wm) / 2;
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(tx, ty, _timeFont, hh, Graphics.TEXT_JUSTIFY_LEFT);
        dc.setColor(ORANGE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(tx + wh, ty, _timeFont, ":", Graphics.TEXT_JUSTIFY_LEFT);
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(tx + wh + wc, ty, _timeFont, mm, Graphics.TEXT_JUSTIFY_LEFT);

        // Date
        var info = Gregorian.info(Time.now(), Time.FORMAT_MEDIUM);
        var dateStr = info.day_of_week.toString().toUpper() + " " + info.day.format("%d") + " " + info.month.toString().toUpper();
        dc.setColor(GREY, Graphics.COLOR_TRANSPARENT);
        dc.drawText(cx, (w * DATE_Y).toNumber(), Graphics.FONT_XTINY, dateStr,
            Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);

        // Countdown to race day
        var msg = longMessage(days);
        if (dc.getTextWidthInPixels(msg, Graphics.FONT_TINY) > w * 0.80) {
            msg = shortMessage(days);
        }
        dc.setColor(ORANGE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(cx, (w * COUNT_Y).toNumber(), Graphics.FONT_TINY, msg,
            Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);

        // Bottom row: heart rate, steps, battery
        var y = (w * ROW_Y).toNumber();
        var font = Graphics.FONT_XTINY;
        var hs = (w * 0.019).toNumber();
        if (hs < 3) {
            hs = 3;
        }
        var hx = (w * 0.33).toNumber();
        drawHeart(dc, hx, y, hs);
        var hr = heartRate();
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(hx + hs * 2 + 3, y, font, hr == null ? "--" : hr.toString(),
            Graphics.TEXT_JUSTIFY_LEFT | Graphics.TEXT_JUSTIFY_VCENTER);

        dc.setColor(SKY, Graphics.COLOR_TRANSPARENT);
        dc.drawText(cx, y, font, groupDigits(steps),
            Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);

        var batt = System.getSystemStats().battery.toNumber();
        var bx = (w * 0.605).toNumber();
        drawBattery(dc, bx, y, (w * 0.05).toNumber(), (w * 0.028).toNumber(), batt);
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_TRANSPARENT);
        dc.drawText(bx + (w * 0.068).toNumber(), y, font, batt.toString() + "%",
            Graphics.TEXT_JUSTIFY_LEFT | Graphics.TEXT_JUSTIFY_VCENTER);
    }

    // ---- helpers ----

    function longMessage(days) {
        if (days > 1) {
            return days.toString() + " DAYS TO YHM 2027";
        } else if (days == 1) {
            return "1 DAY TO YHM 2027";
        } else if (days == 0) {
            return "RACE DAY! YHM 2027";
        }
        return "YHM 2027 FINISHER";
    }

    function shortMessage(days) {
        if (days > 1) {
            return days.toString() + " DAYS TO YHM";
        } else if (days == 1) {
            return "1 DAY TO YHM";
        } else if (days == 0) {
            return "RACE DAY!";
        }
        return "YHM 2027";
    }

    // Days from today (local date) to race day, using day numbers so time zones don't matter
    function daysToRace() {
        var t = Gregorian.info(Time.now(), Time.FORMAT_SHORT);
        return dayNumber(RACE_Y, RACE_M, RACE_D) - dayNumber(t.year, t.month, t.day);
    }

    function dayNumber(y, m, d) {
        var a = (14 - m) / 12;
        var yy = y + 4800 - a;
        var mm = m + 12 * a - 3;
        return d + (153 * mm + 2) / 5 + 365 * yy + yy / 4 - yy / 100 + yy / 400 - 32045;
    }

    function heartRate() {
        var ai = Activity.getActivityInfo();
        if (ai != null && ai.currentHeartRate != null) {
            return ai.currentHeartRate;
        }
        if (ActivityMonitor has :getHeartRateHistory) {
            var it = ActivityMonitor.getHeartRateHistory(1, true);
            if (it != null) {
                var s = it.next();
                if (s != null && s.heartRate != null && s.heartRate != ActivityMonitor.INVALID_HR_SAMPLE) {
                    return s.heartRate;
                }
            }
        }
        return null;
    }

    function groupDigits(n) {
        var s = n.toString();
        var out = "";
        var len = s.length();
        for (var i = 0; i < len; i++) {
            if (i > 0 && (len - i) % 3 == 0) {
                out = out + ",";
            }
            out = out + s.substring(i, i + 1);
        }
        return out;
    }

    function drawHeart(dc, x, y, s) {
        dc.setColor(RED, Graphics.COLOR_TRANSPARENT);
        dc.fillCircle(x - s / 2, y - s / 3, s / 2 + 1);
        dc.fillCircle(x + s / 2, y - s / 3, s / 2 + 1);
        dc.fillPolygon([[x - s - 1, y - s / 4], [x + s + 1, y - s / 4], [x, y + s]]);
    }

    function drawBattery(dc, x, y, bw, bh, pct) {
        if (bh < 6) {
            bh = 6;
        }
        var top = y - bh / 2;
        dc.setColor(GREY, Graphics.COLOR_TRANSPARENT);
        dc.setPenWidth(2);
        dc.drawRectangle(x, top, bw, bh);
        dc.setPenWidth(1);
        dc.fillRectangle(x + bw, y - bh / 4, 3, bh / 2);
        var inner = ((bw - 6) * pct / 100).toNumber();
        if (inner < 1) {
            inner = 1;
        }
        dc.setColor(pct <= 20 ? RED : GREEN, Graphics.COLOR_TRANSPARENT);
        dc.fillRectangle(x + 3, top + 3, inner, bh - 6);
    }
}
