
import { loadMovies, wireMovieToggle } from './movies.js';
import { loadTV, wireTvToggle } from './tv.js';
import { initScrollTopButton } from './scrollTop.js';

const BASE_URL = '/api/tmdb/';
const MAX_TRENDS = 14;


window.addEventListener('DOMContentLoaded', () => {
  // Initial loads
  loadMovies({ apiKey: API_KEY, baseUrl: BASE_URL, max: MAX_TRENDS });
  loadTV({ apiKey: API_KEY, baseUrl: BASE_URL, max: MAX_TRENDS });

  // Re-load movies whenever the toggle changes
  wireMovieToggle(() => {
    loadMovies({ apiKey: API_KEY, baseUrl: BASE_URL, max: MAX_TRENDS });
  });

  // Re-load movies whenever the toggle changes
  wireTvToggle(() => {
    loadTV({ apiKey: API_KEY, baseUrl: BASE_URL, max: MAX_TRENDS });
  });

  initScrollTopButton(); 

});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".scroller-wrap").forEach((wrap) => {
    const scroller = wrap.querySelector(".scroller");
    const btnLeft = wrap.querySelector(".scroll-btn.left");
    const btnRight = wrap.querySelector(".scroll-btn.right");

    if (!scroller || !btnLeft || !btnRight) return;

    // How far each click scrolls (90% of visible width feels great)
    const scrollByAmount = () => Math.round(scroller.clientWidth * 0.9);

    const updateButtons = () => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      const atStart = scroller.scrollLeft <= 2;
      const atEnd = scroller.scrollLeft >= maxScrollLeft - 2;

      btnLeft.classList.toggle("is-disabled", atStart);
      btnRight.classList.toggle("is-disabled", atEnd);
    };

    btnLeft.addEventListener("click", () => {
      scroller.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    });

    btnRight.addEventListener("click", () => {
      scroller.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
    });

    // Update on scroll + on resize
    scroller.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    // Initial state
    updateButtons();
  });
});



// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".scroller").forEach((scroller) => {
//     scroller.addEventListener(
//       "wheel",
//       (e) => {
//         // Only if horizontal scrolling is possible
//         if (scroller.scrollWidth <= scroller.clientWidth) return;

//         const absX = Math.abs(e.deltaX);
//         const absY = Math.abs(e.deltaY);

//         // If user is already scrolling more horizontally (trackpad), do nothing
//         if (absX > absY) return;

//         // Normalize delta to pixels
//         let delta = e.deltaY;

//         // deltaMode: 0=pixels, 1=lines, 2=pages
//         if (e.deltaMode === 1) delta *= 16;        // approx 16px per line
//         else if (e.deltaMode === 2) delta *= 320;  // approx one page

//         // Make it feel responsive (tweak multiplier to taste)
//         const speed = 2.5; // try 1.5–3
//         scroller.scrollLeft += delta * speed;

//         e.preventDefault();
//       },
//       { passive: false }
//     );
//   });
// });



// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".scroller").forEach((scroller) => {
//     scroller.addEventListener(
//       "wheel",
//       (e) => {
//         // Only act if it can actually scroll sideways
//         if (scroller.scrollWidth <= scroller.clientWidth) return;

//         // If user is already doing horizontal trackpad scrolling, let it be
//         if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

//         e.preventDefault(); // required for smooth mapping
//         scroller.scrollLeft += e.deltaY; // vertical wheel -> horizontal scroll
//       },
//       { passive: false }
//     );
//   });
// });



// function enableHorizontalWheelScroll(scroller) {
//   if (!scroller) return;

//   scroller.addEventListener("wheel", (e) => {
//     // If the user is already doing horizontal scrolling (trackpad) let it happen naturally
//     // (Shift+wheel often means horizontal on many systems too)
//     const isTouchPadLike = Math.abs(e.deltaX) > 0;
//     const isShift = e.shiftKey;

//     // If the scroller can scroll horizontally, convert vertical wheel -> horizontal scroll
//     const canScrollHorizontally = scroller.scrollWidth > scroller.clientWidth;

//     if (!canScrollHorizontally) return;

//     // For mouse wheels, deltaX is usually 0; deltaY is vertical
//     // If shift is pressed, some browsers already do horizontal; we can still handle it safely
//     if (!isTouchPadLike) {
//       e.preventDefault(); // must use { passive: false } below
//       const scrollAmount = (isShift ? e.deltaY : e.deltaY);
//       scroller.scrollLeft += scrollAmount;
//     }
//   }, { passive: false });
// }

// // Enable it for all rows you want
// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".movie-scroller").forEach(enableHorizontalWheelScroll);
// });
