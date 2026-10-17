// YHM 2027 watch face: Yavatmal Health Marathon, Sunday 3 January 2027.
// Cotton City Runners Foundation, Yavatmal.
import Toybox.Application;
import Toybox.WatchUi;

class YHMApp extends Application.AppBase {

    function initialize() {
        AppBase.initialize();
    }

    function getInitialView() {
        return [ new YHMView() ];
    }
}
