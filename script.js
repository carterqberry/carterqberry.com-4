// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! I\'ll get back to you soon.');
    event.target.reset();
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

(function () {
  const row = document.querySelector('.portfolio-row');
  const wrapper = document.querySelector('.portfolio-wrapper');
  if (!row || !wrapper) return;

  // create references to existing scrollbar elements (if you inserted HTML)
  const scrollbar = wrapper.querySelector('.portfolio-scrollbar');
  const track = scrollbar.querySelector('.ps-track');
  const thumb = scrollbar.querySelector('.ps-thumb');

  // helper: update thumb size and position
  function updateThumb() {
    const containerWidth = row.clientWidth;
    const contentWidth = row.scrollWidth;
    const trackWidth = track.clientWidth;

    if (contentWidth <= containerWidth) {
      thumb.style.width = trackWidth + 'px';
      thumb.style.left = '0px';
      thumb.setAttribute('aria-valuenow', 0);
      thumb.setAttribute('aria-valuemax', 0);
      thumb.setAttribute('aria-disabled', 'true');
      thumb.style.opacity = 0.5;
      return;
    }

    const ratio = containerWidth / contentWidth;
    const thumbWidth = Math.max(Math.floor(trackWidth * ratio), 36); // min size
    const maxThumbLeft = trackWidth - thumbWidth;
    const scrollRatio = row.scrollLeft / (contentWidth - containerWidth);
    const thumbLeft = Math.round(scrollRatio * maxThumbLeft);

    thumb.style.width = thumbWidth + 'px';
    thumb.style.left = thumbLeft + 'px';

    // set accessible values
    thumb.setAttribute('aria-valuemin', 0);
    thumb.setAttribute('aria-valuemax', Math.max(0, contentWidth - containerWidth));
    thumb.setAttribute('aria-valuenow', row.scrollLeft);
    thumb.removeAttribute('aria-disabled');
    thumb.style.opacity = 1;
  }

  // sync when user scrolls the row
  row.addEventListener('scroll', updateThumb, { passive: true });

  // handle window/element resize
  const ro = new ResizeObserver(updateThumb);
  ro.observe(row);
  ro.observe(track);

  // drag logic for the thumb
  let isDragging = false;
  let dragStartX = 0;
  let thumbStartLeft = 0;

  thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    thumbStartLeft = parseInt(thumb.style.left || 0, 10);
    document.documentElement.classList.add('ps-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const trackWidth = track.clientWidth;
    const thumbWidth = thumb.getBoundingClientRect().width;
    const maxLeft = trackWidth - thumbWidth;
    let newLeft = thumbStartLeft + dx;
    newLeft = Math.max(0, Math.min(maxLeft, newLeft));

    // compute corresponding scroll position
    const scrollRatio = newLeft / maxLeft;
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    row.scrollLeft = Math.round(scrollRatio * maxScrollLeft);
    updateThumb();
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.documentElement.classList.remove('ps-dragging');
  });

  // allow clicking on track to jump
  track.addEventListener('click', (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const thumbWidth = thumb.getBoundingClientRect().width;
    const newLeft = Math.max(0, clickX - thumbWidth / 2);
    const maxLeft = rect.width - thumbWidth;
    const clamped = Math.min(maxLeft, Math.max(0, newLeft));
    const scrollRatio = clamped / maxLeft;
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    row.scrollLeft = Math.round(scrollRatio * maxScrollLeft);
    updateThumb();
  });

  // keyboard support for accessibility (left/right arrows, home/end)
  thumb.addEventListener('keydown', (e) => {
    const key = e.key;
    const step = Math.max(30, row.clientWidth * 0.1); // step size
    if (key === 'ArrowLeft') {
      row.scrollBy({ left: -step, behavior: 'smooth' });
      e.preventDefault();
    } else if (key === 'ArrowRight') {
      row.scrollBy({ left: step, behavior: 'smooth' });
      e.preventDefault();
    } else if (key === 'Home') {
      row.scrollTo({ left: 0, behavior: 'smooth' });
      e.preventDefault();
    } else if (key === 'End') {
      row.scrollTo({ left: row.scrollWidth, behavior: 'smooth' });
      e.preventDefault();
    }
  });

  // update on load
  requestAnimationFrame(updateThumb);

  // optional: show scrollbar only when content overflows
  function toggleScrollbarVisibility() {
    if (row.scrollWidth <= row.clientWidth) {
      scrollbar.style.display = 'none';
    } else {
      scrollbar.style.display = 'block';
    }
  }
  window.addEventListener('resize', () => {
    toggleScrollbarVisibility();
    updateThumb();
  });
  toggleScrollbarVisibility();

  // If user scrolls with mouse wheel vertically while hovering the row, we prefer horizontal scroll (nice UX)
  row.addEventListener('wheel', (e) => {
    // if shift pressed or horizontal wheel, let browser handle
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    // if vertical wheel over the row, translate into horizontal scroll
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    }
  }, { passive: false });
})();