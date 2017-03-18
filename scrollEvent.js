
class scrollEvent {

    constructor() {
        // this is working in progress scrollEvent class.
        // We will add more scroll events in the file
        // that can be shared across the whole site.
    }

    //throttle scrolling event to improve performance
    throttle (callback, wait) {
        var time,
            go = true;
        return function() {
            if(go) {
                go = false;
                time = setTimeout(function(){
                    time = null;
                    go = true;
                    callback.call();
                }, wait);
            }
        }
    }

    //debounce scrolling event to improve performance
    debounce (callback, delay) {
        var timeout = null;
        return function() {
            if (timeout) {
                clearTimeout(timeout);
            }
            var args = arguments;
            timeout = setTimeout(function() {
                callback.apply(null, args);
                timeout = null;
            }, delay);
        }
    }

};

export default new scrollEvent();
