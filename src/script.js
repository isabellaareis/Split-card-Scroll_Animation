document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    /* --------------------
       Lenis
    -------------------- */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const cardContainer = document.querySelector(".card-container");
    const cards = gsap.utils.toArray(".card");
    const stickyHeader = document.querySelector(".sticky-header h1");

    function initAnimations() {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        const mm = gsap.matchMedia();

        /* --------------------
           Mobile reset
        -------------------- */
        mm.add("(max-width: 999px)", () => {
            document
                .querySelectorAll(".card, .card-container, .sticky-header h1")
                .forEach((el) => (el.style = ""));
            return {};
        });

        /* --------------------
           Desktop animations
        -------------------- */
        mm.add("(min-width: 1000px)", () => {
            ScrollTrigger.create({
                trigger: ".sticky",
                start: "top top",
                end: `+=${window.innerHeight * 4}px`,
                scrub: 1,
                pin: true,
                pinSpacing: true,

                onUpdate: (self) => {
                    const progress = self.progress;

                    /* --------------------
                       Header animation
                    -------------------- */
                    if (progress >= 0.1 && progress <= 0.25) {
                        const headerProgress = gsap.utils.mapRange(
                            0.1,
                            0.25,
                            0,
                            1,
                            progress
                        );

                       gsap.set(stickyHeader, {
                            y: gsap.utils.mapRange(0, 1, 60, 0, headerProgress), 
                            opacity: headerProgress,
                        });
                    } else if (progress < 0.1) {
                        gsap.set(stickyHeader, { y: 40, opacity: 0 });
                    } else if (progress > 0.25) {
                        gsap.set(stickyHeader, { y: 0, opacity: 1 });
                    }

                    /* --------------------
                       Container expand + gap
                    -------------------- */
                    if (progress >= 0.25 && progress <= 0.45) {
                        const containerProgress = gsap.utils.mapRange(
                            0.25,
                            0.45,
                            0,
                            1,
                            progress
                        );

                        gsap.set(cardContainer, {
                            width: `${gsap.utils.mapRange(
                                0,
                                1,
                                75,
                                100,
                                containerProgress
                            )}%`,
                            gap: `${gsap.utils.mapRange(
                                0,
                                1,
                                0,
                                24,
                                containerProgress
                            )}px`,
                        });
                    }

                    /* --------------------
                       Cards flip (3D)
                    -------------------- */
                    if (progress >= 0.45) {
                        cards.forEach((card, index) => {
                            const start = 0.45 + index * 0.05;
                            const end = start + 0.2;

                            const flipProgress = gsap.utils.clamp(
                                0,
                                1,
                                gsap.utils.mapRange(start, end, 0, 1, progress)
                            );

                            gsap.set(card, {
                                rotateY: gsap.utils.mapRange(
                                    0,
                                    1,
                                    0,
                                    180,
                                    flipProgress
                                ),
                            });
                        });
                    } else {
                        gsap.set(cards, { rotateY: 0 });
                    }
                },
            });
        });
    }

    initAnimations();

    /* --------------------
       Resize handler
    -------------------- */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initAnimations();
        }, 250);
    });
});