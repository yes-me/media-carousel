import Viewports from "./Viewports";
import scrollEvent from './scrollEvent';
/**
 * MediaCarousel class.
 * It allows users to navigate contents on unlimited carousels on tablet and desktop view
 * On mobile view the carousels show more items by clicking on load more button
 */
class MediaCarousel {

    constructor() {

        this.viewports = new Viewports();

        this.initCarousels();

        this.initShowMore();

        this.onResize();

    }
    /**
     * @desc initialization function to activate load more button events on mobile
     */
    initShowMore() {

        this.showMoreButtons = document.querySelectorAll('.show-more');

        /**
         * showMoreCounts keep track of items that are being showing on the page
         * @type {Array}
         */
        this.showMoreCounts = [];
        this.loadMoreEvent();
    }

    /**
     * @desc keep track how many items has been shown
     * on page load, there are 3 items shown, it shows 3 more each time by clicking on load more button
     */
    loadMore() {
        let elm = event.currentTarget;
        /**
         * slider dom selector that is passed from showMoreButtons click event.
         */
        let slider = elm.slider;
        //get dom element inside the slider
        let items = slider.querySelectorAll('.media-carousel-link');
        let totalCount = items.length;

        /**
         * before the load more button is triggered, this.showMoreCounts[elm.index] will be equal to 3
         * Since we show 3 items on page load, the index starts at 0, we have shown item index 0,1 and 2
         * @type {Number}
         */
        let start = this.showMoreCounts[elm.index];

        //add 3 more to start index since we want to load 3 more items whenever users click on load more button
        let end = start + 3;

        for (let i=start; i< end && this.showMoreCounts[elm.index] < totalCount; i++) {
            if (items[i]) {
                items[i].style.display = 'block';
                //increase the count by 1 for each item that we show
                this.showMoreCounts[elm.index]++;
            }
        }

        /**
         * this.showMoreCounts[elm.index] is equal to total items in the carousel
         * that means no more items to show, hide the show more button
         */
        if ( this.showMoreCounts[elm.index] >= totalCount ) {
            elm.style.display = 'none';
        };

    }

    /**
     * @desc Load more button event handler
     */
    loadMoreEvent() {

        for (let i = 0, l = this.showMoreButtons.length; i < l; i++) {
            /**
             * get slider container that is in the same container for load more button
             */
            let slider = document.querySelectorAll('.media-carousel-slider')[i];
            /**
             * attach the slider dom selector to click event listener
             * so that we can update the styles of children inside the slider
             * on the callback function
             */
            this.showMoreButtons[i].slider = slider;
            /**
             * initialize the total count of items that is showed on the page
             * @type {number}
             */
            this.showMoreCounts[i] = 3;
            /**
             * attach load more button index to the callback so that we know which button users click
             * @type {number}
             */
            this.showMoreButtons[i].index = i;
            this.showMoreButtons[i].addEventListener('click', this.loadMore.bind(this));

        }

    }

    /**
     * @desc initialize Carousels
     */
    initCarousels() {
        this.prevButtons = document.querySelectorAll('.media-carousel-prev');
        this.nextButtons = document.querySelectorAll('.media-carousel-next');
        this.image = document.querySelector('.media-carousel-link');
        /**
         * get image width using clientWidth. Please make sure using padding instead of margin on image css
         * since clientWidth returns total width including border and padding, but not margin
         * @type {number}
         */
        this.imageWidth = (this.image)? this.image.clientWidth : 0;
        /**
         * carousels selector for updating the styling when users click on next or previous button
         * @type {Element|*|{id}}
         */
        this.slider = document.querySelector('.media-carousel-slider');
        /**
         * navigateWidths stores updated widths for each carousel when users click on next or previous button.
         * On each carousel (array index), the navigated width is initialized with 0.
         * When user clicks on next button on the first carousel, this.navigateWidths[0] -= this.imageWidth
         * When user clicks on previous button on the first carousel, this.navigateWidths[0] += this.imageWidth
         * @type {Array}
         */
        this.navigateWidths = [];
        this.buttonOnEvents();
    }

    /**
     * @desc hide and show next and previous button based on the total width of carousel that users navigate
     * @param Number i Carousel element index. first Carousel will have index 0; second will be 1 and so on
     * @param String dir Navigation button either 'next' or 'prev'
     * @param Number totalW width of carousel that users navigate
     */
    updateButtonStyles(i, dir, totalW) {

        let prevBtnStyle = this.prevButtons[i].style;
        let nextBtnStyle = this.nextButtons[i].style;

        if (dir === 'next') {
            /**
             * On page load previous button is hidden. If navigateWidths[i] is equal to minus this.imageWidth,
             * it means user clicks on Next button once, show previous button
             */
            if (this.navigateWidths[i] === -this.imageWidth) {
                prevBtnStyle.display = 'block';
            }
            /**
             * if this.navigateWidths[i] is less than or equal to minus totalW
             * that means users has viewed all the slide images and there is
             * no more image after the Next button, hide the next button
             */
            if (this.navigateWidths[i] <= -totalW ) {
                nextBtnStyle.display = 'none';
            }

        } else {
            if (this.navigateWidths[i] === 0) {
                /**
                 * hide the previous button when this.navigateWidths[i] is equal to zero
                 */
                prevBtnStyle.display = 'none';
            } else if (nextBtnStyle.display = 'none') {
                nextBtnStyle.display = 'block'
            }
        }
    }

    /**
     * add transform style on media-carousel-slider selector to move elements inside the carousels backward or forward
     * @param event
     */
    updateSlideTransition(event) {

        let elm = event.currentTarget;
        /**
         * direction is passed from buttonOnEvents click event.
         * It is equal to either 'next' or 'prev'
         */
        let direction = elm.direction;
        /**
         * i is passed from buttonOnEvents click event that indicates the navigation button index
         */
        let i = elm.index;


        if (direction === 'next') {
            /**
             * get slider element style property
             * elm is media-carousel-next[i], so elm.previousElementSibling.children[0] is equal to media-carousel-slider[i]
             * @type {CSSStyleDeclaration}
             */
            let sliderStyle = elm.previousElementSibling.children[0].style;

            this.navigateWidths[i] -= this.imageWidth;
            sliderStyle.transform = `translateX(${this.navigateWidths[i]}px)`;
            sliderStyle.webkitTransform = `translateX(${this.navigateWidths[i]}px)`;

        } else {
            /**
             * elm is media-carousel-prev[i], so elm.nextElementSibling.children[0] is equal to media-carousel-slider[i]
             * @type {CSSStyleDeclaration}
             */
            let sliderStyle = elm.nextElementSibling.children[0].style;
            /**
             * update this.navigateWidths[i] with a positive number since we are adding translateX style to move the element forward
             * @type {number|*}
             */

            this.navigateWidths[i] += this.imageWidth;
            sliderStyle.transform = `translateX(${this.navigateWidths[i]}px)`;
            sliderStyle.webkitTransform = `translateX(${this.navigateWidths[i]}px)`;
        }

        this.updateButtonStyles(i, direction, elm.totalWidth);
    }

    /**
     * get total width of carousel. We want to use this total width to compare
     * the total number of images that users navigate to determine to hide and show
     * the next and previous button.
     * @param Number i
     * @returns {number}
     */
    getTotalWidth(i) {
        let slider = document.querySelectorAll('.media-carousel-slider')[i];
        let totalWidth = this.imageWidth;

        if (slider) {
            let imageLen = slider.getElementsByTagName('a').length;

            if (this.viewPort ===  'tablet') {
                //on tablet, we show 2 images on the page, we need to minus 2 from the total number of images
                imageLen -= 2;
            } else {
                //on desktop, we show 3 images on the page, we need to minus 3 from the total number of images
                imageLen -= 3;
            }

            totalWidth *= imageLen;
        }
        return totalWidth;
    }

    /**
     * attach addEventListener on each next or previous button on all carousels
     */
    buttonOnEvents() {
        /**
         * since nextButtons is equal to prevButtons, we only need to loop through nextButtons
         * and attach click eventListener on next and previous buttons indexes
         */
        for (let i = 0, l = this.nextButtons.length; i < l; i++) {

            let totalWidth = this.getTotalWidth(i);

            this.navigateWidths[i] = 0;
            /**
             * attach nextButtons index to addEventListener
             * @type {number}
             */
            this.nextButtons[i].index = i;
            /**
             * attach direction 'next' to addEventListener
             * @type {string}
             */
            this.nextButtons[i].direction = 'next';
            this.nextButtons[i].totalWidth = totalWidth;
            this.nextButtons[i].addEventListener('click', this.updateSlideTransition.bind(this));

            /**
             * attach prevButtons index to addEventListener
             * @type {number}
             */
            this.prevButtons[i].index = i;
            /**
             * attach direction 'prev' to addEventListener
             * @type {string}
             */
            this.prevButtons[i].direction = 'prev';
            this.prevButtons[i].totalWidth = totalWidth;
            this.prevButtons[i].addEventListener('click', this.updateSlideTransition.bind(this));
        }
    }

    /**
     * event handler on window resize
     */
    onResize() {
        window.addEventListener("resize", () => {
            scrollEvent.debounce(200, this.updateDomStyles());
    });
    }

    /**
     * @desc resize handler when users resize window from mobile view to tablet or desktop view
     * remove the block styles that are added on each item inside the each slider
     * when users click on load more button on mobile view since the style is inline-block
     * on tablet or desktop view
     * @param Object carousel slider container
     */
    removeSliderItemStyle(slider) {
        let items = slider.querySelectorAll('.media-carousel-link');
        for (let i=3, l=items.length; i< l; i++) {
            if ( "" !== items[i].getAttribute('style') ) {
                items[i].removeAttribute('style')
            }
        }
    }

    /**
     * @desc resize handler when users resize window from mobile view to tablet or desktop view,
     * or resize window from tablet or desktop view to mobile view
     */
    updateDomStyles() {
        let viewPort = this.viewports.getViewPort();

        if (viewPort === 'mobile') {
            //reset this.showMoreCounts init count on mobile view after window resize
            for (let i=0, l=this.showMoreButtons.length; i<l; i++) {
                this.showMoreCounts[i] = 3;
            }

        } else {
            let sliders = document.querySelectorAll('.media-carousel-slider');
            for (let i=0, l=sliders.length; i<l; i++) {
                //remove each slider transform style on window resize to reset the carousel position
                if ( "" !== sliders[i].getAttribute('style') ) {
                    sliders[i].removeAttribute('style')
                }
                //reset previous button style
                if ( "" !== this.prevButtons[i].style.display) {
                    this.prevButtons[i].style.display = 'none';
                }
                /**
                 * remove the styles that are added on each item inside the each slider
                 * when users click on load more button on mobile view
                 */
                this.removeSliderItemStyle(sliders[i]);
                //reset each slider navigation width
                this.navigateWidths[i] = 0;
            }
            //reset image width since image width is different in size on different viewport
            this.imageWidth = (this.image)? this.image.clientWidth : 0;
        }
    }

}

export default new MediaCarousel();