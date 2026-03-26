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

  const scrollbar = wrapper.querySelector('.portfolio-scrollbar');
  const track = scrollbar.querySelector('.ps-track');
  const thumb = scrollbar.querySelector('.ps-thumb');

  let rafId = null;
  let isDragging = false;
  let dragPointerOffsetX = 0;
  let previousScrollBehavior = '';

  function getMetrics() {
    const containerWidth = row.clientWidth;
    const contentWidth = row.scrollWidth;
    const trackWidth = track.clientWidth;
    const maxScrollLeft = Math.max(0, contentWidth - containerWidth);
    const ratio = contentWidth > 0 ? containerWidth / contentWidth : 1;
    const thumbWidth = maxScrollLeft > 0 ? Math.max(Math.floor(trackWidth * ratio), 36) : trackWidth;
    const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);

    return {
      containerWidth,
      contentWidth,
      trackWidth,
      maxScrollLeft,
      thumbWidth,
      maxThumbLeft
    };
  }

  function updateThumb() {
    const {
      containerWidth,
      contentWidth,
      trackWidth,
      maxScrollLeft,
      thumbWidth,
      maxThumbLeft
    } = getMetrics();

    if (contentWidth <= containerWidth) {
      thumb.style.width = trackWidth + 'px';
      thumb.style.setProperty('--thumb-x', '0px');
      thumb.setAttribute('aria-valuenow', 0);
      thumb.setAttribute('aria-valuemax', 0);
      thumb.setAttribute('aria-disabled', 'true');
      thumb.style.opacity = 0.5;
      return;
    }

    const scrollRatio = maxScrollLeft > 0 ? row.scrollLeft / maxScrollLeft : 0;
    const thumbLeft = Math.round(scrollRatio * maxThumbLeft);

    thumb.style.width = thumbWidth + 'px';
    thumb.style.setProperty('--thumb-x', `${thumbLeft}px`);

    thumb.setAttribute('aria-valuemin', 0);
    thumb.setAttribute('aria-valuemax', maxScrollLeft);
    thumb.setAttribute('aria-valuenow', row.scrollLeft);
    thumb.removeAttribute('aria-disabled');
    thumb.style.opacity = 1;
  }

  // Debounced update using requestAnimationFrame
  function scheduleThumbUpdate() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      updateThumb();
      rafId = null;
    });
  }

  // Sync when user scrolls the row
  row.addEventListener('scroll', scheduleThumbUpdate, { passive: true });

  // Handle window/element resize
  const ro = new ResizeObserver(() => {
    scheduleThumbUpdate();
  });
  ro.observe(row);
  ro.observe(track);

  function dragToClientX(clientX, pointerOffsetX = null) {
    const { maxScrollLeft, thumbWidth, maxThumbLeft } = getMetrics();
    const rect = track.getBoundingClientRect();
    const pointerX = clientX - rect.left;
    const offsetX = pointerOffsetX ?? (thumbWidth / 2);
    const unclampedLeft = pointerX - offsetX;
    const thumbLeft = Math.max(0, Math.min(maxThumbLeft, unclampedLeft));
    const scrollRatio = maxThumbLeft > 0 ? thumbLeft / maxThumbLeft : 0;
    row.scrollLeft = Math.round(scrollRatio * maxScrollLeft);
  }

  thumb.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragPointerOffsetX = e.clientX - thumb.getBoundingClientRect().left;
    previousScrollBehavior = row.style.scrollBehavior;
    row.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('ps-dragging');
    thumb.classList.add('is-dragging');
    thumb.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  thumb.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    dragToClientX(e.clientX, dragPointerOffsetX);
  });

  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    dragPointerOffsetX = 0;
    row.style.scrollBehavior = previousScrollBehavior;
    document.documentElement.classList.remove('ps-dragging');
    thumb.classList.remove('is-dragging');
  }

  thumb.addEventListener('pointerup', stopDragging);
  thumb.addEventListener('pointercancel', stopDragging);
  thumb.addEventListener('lostpointercapture', stopDragging);

  // Allow clicking on track to jump
  track.addEventListener('pointerdown', (e) => {
    if (e.target === thumb) return;
    dragToClientX(e.clientX);
  });

  // Keyboard support
  thumb.addEventListener('keydown', (e) => {
    const key = e.key;
    const step = Math.max(30, row.clientWidth * 0.1);
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

  // Initial update
  requestAnimationFrame(updateThumb);

  // Toggle scrollbar visibility
  function toggleScrollbarVisibility() {
    if (row.scrollWidth <= row.clientWidth) {
      scrollbar.style.display = 'none';
    } else {
      scrollbar.style.display = 'block';
    }
  }
  
  window.addEventListener('resize', () => {
    toggleScrollbarVisibility();
    scheduleThumbUpdate();
  });
  
  toggleScrollbarVisibility();
})();
