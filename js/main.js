class myCarousel {
    constructor(settings) {
        this.settings = Object.assign(this.defaultSettings, settings);
    }

    defaultSettings = {
        selector: '.my-carousel',
        arrows: false,
        dots: false,
        loop: false,
        autoPlay: false,
        interval: 5000,
        scrollTime: 1700,
    }
    state = {
        currentSlide: 0,
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
    }

    templates = {
        renderDots: function (slides) {
            return (`
             <div class="carousel-dots">
                ${slides.map(function (_, i) {
                return (
                    `<span class="carousel-dot" data-dots="${i}">
                 
                 </span>`
                )
            }).join('')}
             </div>
                   `)
        },
        renderArrows: function () {
            return `
           <div class="carousel-arrows">
                <span class="arrows arrow-prev" data-dots="prev"></span>
                <span class="arrows arrow-next" data-dots="next"></span>
           </div>
                  `
        },
        renderTrack: function (slides, scrollTime) {
            return `
            <div class="carousel-list">
                  <div class="carousel-track" style="transition: ${scrollTime}ms">
                    ${slides}
                  </div>
            </div>
            `
        },
        renderSlides: function (slides) {
            return slides.map((slide, i) => {
                return `
                <div class="carousel-slide" data-slide="${i + 1}">${slide.outerHTML}</div>
                `
            }).join("")
        },

    }

    render() {
        const slider = document.querySelector(this.settings.selector);
        const sliderChildren = Array.from(slider.children);
        const slides = this.templates.renderSlides(sliderChildren);
        slider.innerHTML = this.templates.renderTrack(slides, this.settings.scrollTime);

        if (this.settings.dots) {
            const dots = this.templates.renderDots(sliderChildren)
            slider.insertAdjacentHTML('beforeend', dots);

        }

        if (this.settings.arrows) {
            const arrows = this.templates.renderArrows()
            slider.insertAdjacentHTML('beforeend', arrows);
        }
        this.setState({
            slidesCount: sliderChildren.length,
            currentSlide: 0,
            elements: {
                slider: slider,
                track: slider.querySelector('.carousel-track'),
                next: slider.querySelector('.arrow-next'),
                prev: slider.querySelector('.arrow-prev'),
                dots: slider.querySelector('.carousel-dots'),

            }
        })
    }

    arrowsEvents() {
        const prev = (this.state.elements.prev)
        const next = (this.state.elements.next)
        next.addEventListener('click', (event) => {
            this.nextSlide(event.target)
        })
        prev.addEventListener('click', (event) => {
            this.prevSlide(event.target)
        })
    }

    dotsEvent() {
        const dots = this.state.elements.dots
        const track = this.state.elements.track;
        dots.addEventListener('click', (event) => {
            let eTarget = event.target
            if (eTarget.closest('.carousel-dot')) {

                this.state.currentSlide = -eTarget.dataset.dots
                track.style.transform = `translateX(${this.state.currentSlide * 100}%)`;
            }
        })
    }

    nextSlide() {
        const track = this.state.elements.track;
        if (Math.abs(this.state.currentSlide) === this.state.slidesCount  && this.settings.loop) this.state.currentSlide = 1
        if (Math.abs(this.state.currentSlide) === this.state.slidesCount - 1) return

        this.state.currentSlide -= 1;

        track.style.transform = `translateX(${this.state.currentSlide * 100}%)`;

    }

    prevSlide() {
        const track = this.state.elements.track;
        if (Math.abs(this.state.currentSlide) === 0 && this.settings.loop) this.state.currentSlide = -this.state.slidesCount
        if (Math.abs(this.state.currentSlide) === 0) return;
        this.state.currentSlide += 1;
        track.style.transform = `translateX(${this.state.currentSlide * 100}%)`;
    }

    autoPlay(interval) {
        setInterval(() => {
            this.nextSlide()
        }, interval)

    }

    init() {
        this.render()

        if (this.settings.arrows) this.arrowsEvents()
        if (this.settings.dots) this.dotsEvent()
        if (this.settings.autoPlay) this.autoPlay(this.settings.interval)

    }

}

const carousel = new myCarousel(
    {
        selector: '.slider',
        dots: true,
        arrows: true,
        loop: true,
        autoPlay: true,
        interval: 5000,
        scrollTime: 1700,
    }
)
carousel.init()
