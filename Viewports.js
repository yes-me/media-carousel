class Viewports {

    constructor(viewports = { 'mobile': 767, 'tablet': 768, 'desktop': 1024 }) {
        this.winW = window.innerWidth;
        this.winH = window.innerHeight;
        this.docW = document.body.clientWidth;
        this.isIPad = navigator.userAgent.match(/iPad/i);
        this.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i);
        this.isTouch = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
        this.viewPorts = viewports;

        window.addEventListener("resize", () => {
            this.setWinW(window.innerWidth);
            this.setWinH(window.innerHeight);
            this.setDocW(document.body.clientWidth);
        });

    }

    //setter for window inner width
    setWinW(w) {
        this.winW = w;
    }

    //getter for window inner width
    getWinW() {
        return this.winW;
    }

    //setter for document body clientWidth
    setDocW(w) {
        this.docW = w;
    }

    //getter for document body clientWidth
    getDocW() {
        return this.docW;
    }


    //setter for winH
    setWinH(h) {
        this.winH = h;
    }

    //getter for winH
    getWinH() {
        return this.winH;
    }

    getViewPort() {
        let winW = this.winW;
        return (winW <= this.viewPorts.mobile) ? 'mobile' : ((winW >= this.viewPorts.desktop) ? 'desktop' : 'tablet');
    }

    /**
     * @desc checking element is in view. This function works well to determine if the element is in view,
     * but it takes a little time to do the calculation to get top, bottom, left and right positions
     * @param object el
     * @return bool - true or false
     */
    isElmInViewport(el) {

        let rect = el.getBoundingClientRect();

        return (
            rect && rect.top >= 0 && rect.left >= 0 && rect.bottom <= this.winH && rect.right <= this.winW
        );
    }

    /**
     * @desc checking element top postion is passing . This function works faster than the above isElmInViewport ,
     * since we only need to check elment top position. This should be good to use if we just want to check the scroll
     * position and doing pinning or lazyloading the scripts
     * @param dom object el
     * @param Number offet: passing an offet here if we want the scroll event rendered a bit early
     * @return bool - true or false
     */
    isElmTopPosPassing(el, offet) {

        let rect = el.getBoundingClientRect();
        let checkPos = undefined;

        if (offet !== undefined && !isNaN(offet)) {
            checkPos = rect.top - offet;
        } else {
            checkPos = rect.top;
        }

        return (
            checkPos <= this.winH
        );
    }

}

export default Viewports;