// Loading intro — plays once per browser session, then reveals the site.
(() => {
  const intro = document.getElementById("loading-intro");
  if (!intro) return;

  const alreadyShown = sessionStorage.getItem("miura_intro_shown");

  if (alreadyShown) {
    intro.classList.add("intro-skip");
    document.body.classList.remove("intro-active");
    return;
  }

  document.body.classList.add("intro-active");
  sessionStorage.setItem("miura_intro_shown", "1");

  window.setTimeout(() => {
    intro.classList.add("intro-hidden");
    document.body.classList.remove("intro-active");
  }, 1900);

  window.setTimeout(() => {
    intro.style.display = "none";
  }, 2600);
})();

// Hero title — letters reveal one by one, hold, then fade out and
// reveal again — loops on its own, no click needed. Single solid color.
(() => {
  const HOLD_MS = 2600; // how long the text stays fully visible
  const GAP_MS = 500; // pause while hidden before it comes back
  const STEP_MS = 90; // delay between each letter

  function playLoop(letters) {
    const cycleSpan = (letters.length - 1) * STEP_MS + 600; // matches CSS transition duration

    function show() {
      letters.forEach((letter) => letter.classList.add("in"));
      window.setTimeout(hide, cycleSpan + HOLD_MS);
    }

    function hide() {
      letters.forEach((letter) => letter.classList.remove("in"));
      window.setTimeout(show, cycleSpan + GAP_MS);
    }

    show();
  }

  function playHeroReveal() {
    const title = document.querySelector("#home .name");
    if (!title) return;

    const fullText = title.textContent;
    title.setAttribute("aria-label", fullText);
    title.textContent = "";

    const chars = Array.from(fullText);
    const letters = [];

    chars.forEach((ch) => {
      if (ch === " ") {
        title.appendChild(document.createTextNode(" "));
        return;
      }
      const letter = document.createElement("span");
      letter.className = "letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = ch;
      title.appendChild(letter);
      letters.push(letter);
    });

    letters.forEach((letter, i) => {
      letter.style.transitionDelay = `${i * STEP_MS}ms`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        playLoop(letters);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const introPlaying = document.body.classList.contains("intro-active");
    window.setTimeout(playHeroReveal, introPlaying ? 2000 : 150);
  });
})();
// Mobile hamburger menu toggle.
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const closeBtn = document.getElementById("mobileMenuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;
  const openMenu = () => {
    mobileMenu.classList.add("open");
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

// Highlights the nav link for the section currently in view.
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navlinks a");

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.style.color =
        link.getAttribute("href") === `#${id}` ? "#3FA3B0" : "";
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
});

// Portfolio category filter.
document.addEventListener("DOMContentLoaded", () => {
  const grids = document.querySelectorAll(".grid[data-portfolio-grid]");
  if (!grids.length || typeof PORTFOLIO_ITEMS === "undefined") return;

  grids.forEach((grid) => {
    const section = grid.closest("section");
    const filterRow = section ? section.querySelector(".filter-row") : null;
    const limit = parseInt(grid.dataset.limit) || 0; // 0 = sınırsız
    const viewAllLink = section ? section.querySelector(".view-all a") : null;

    // grid'i verilen filtreye göre yeniden çizer (limit'e uyarak)
    function renderGrid(filter) {
      grid.innerHTML = "";
      let shown = 0;

      PORTFOLIO_ITEMS.forEach((item) => {
        const match = filter === "all" || item.category === filter;
        if (!match) return;
        if (limit && shown >= limit) return;
        shown++;

        const tile = document.createElement("div");
        tile.className = "g-tile";
        tile.dataset.category = item.category;
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", item.caption);
        tile.style.backgroundImage = `url("images/${item.file}")`;
        tile.style.backgroundSize = "cover";
        tile.style.backgroundPosition = item.position || 'center';
        tile.innerHTML = `<div class="tint"></div><span class="cap">${item.caption}</span>`;
        grid.appendChild(tile);
      });

      attachLightbox(grid);

      if (shown === 0) {
        grid.innerHTML =
          '<div class="g-empty">More work from this category coming soon.</div>';
      }

      if (viewAllLink && limit) {
        viewAllLink.textContent =
          filter === "all" ? "See full portfolio →" : "View More →";
        viewAllLink.href =
          filter === "all"
            ? "portfolio.html"
            : `portfolio.html?filter=${filter}`;
      }
    }

    // senin gönderdiğin basit filtre mantığı — sadece renderGrid çağırıyor
    if (filterRow) {
      const tabs = filterRow.querySelectorAll("span[data-filter]");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          renderGrid(tab.dataset.filter);
        });
      });
    }

    // portfolio.html?filter=weddings ile gelindiyse otomatik uygula
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get("filter");
    if (urlFilter && filterRow) {
      const targetTab = filterRow.querySelector(
        `span[data-filter="${urlFilter}"]`,
      );
      if (targetTab) {
        filterRow
          .querySelectorAll("span[data-filter]")
          .forEach((t) => t.classList.remove("active"));
        targetTab.classList.add("active");
        renderGrid(urlFilter);
        return;
      }
    }

    renderGrid("all"); // ilk açılışta
  });
});


let lightboxImages = [];
let lightboxIndex = 0;

function attachLightbox(container) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox || !lightboxImg) return;

  
  lightboxImages = Array.from(container.querySelectorAll(".g-tile")).map(
    (tile) => {
      const bg = getComputedStyle(tile).backgroundImage;
      return bg.split(",")[0].slice(5, -2).replace(/["']/g, "");
    },
  );

  container.querySelectorAll(".g-tile").forEach((tile, i) => {
    if (!tile.querySelector(".view-icon")) {
      const icon = document.createElement("div");
      icon.className = "view-icon";
      icon.innerHTML =
        '<svg viewBox="0 0 24 16" width="24" height="16"><path d="M1,8 Q12,1 23,8 Q12,15 1,8 Z" fill="none" stroke="#F1ECE0" stroke-width="1.3"/><circle cx="12" cy="8" r="3" fill="#3FA3B0"/></svg>';
      tile.appendChild(icon);
    }

    tile.addEventListener("click", () => {
      lightboxIndex = i;
      showLightboxImage();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
}

function showLightboxImage() {
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightboxImg || !lightboxImages.length) return;
  lightboxImg.src = lightboxImages[lightboxIndex];
}

function lightboxNext() {
  if (!lightboxImages.length) return;
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  showLightboxImage();
}

function lightboxPrev() {
  if (!lightboxImages.length) return;
  lightboxIndex =
    (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}


document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrevBtn = document.getElementById("lightboxPrev");
  const lightboxNextBtn = document.getElementById("lightboxNext");
  if (!lightbox) return;

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (lightboxPrevBtn)
    lightboxPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxPrev();
    });
  if (lightboxNextBtn)
    lightboxNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxNext();
    });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft") lightboxPrev();
  });
});

// Mobile portfolio slider — auto-advances every few seconds.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  const isMobile = () => window.innerWidth <= 900;

  setInterval(() => {
    if (!isMobile()) return;
    const step = grid.clientWidth * 0.82;
    const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10;
    if (atEnd) {
      grid.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: step, behavior: "smooth" });
    }
  }, 3500);
});

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("service-select");
  if (!wrap) return;

  const trigger = document.getElementById("service-trigger");
  const label = trigger.querySelector(".custom-select-label");
  const options = document.getElementById("service-options");
  const hiddenInput = document.getElementById("service-type");
  const items = options.querySelectorAll("li");

  const closeDropdown = () => {
    wrap.classList.remove("open");
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      label.textContent = item.textContent;
      hiddenInput.value = item.dataset.value;
      wrap.classList.add("has-value");
      closeDropdown();
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });
});


//maill senddd
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwsrc_mCf0Nw0wPEQxM8Ul2zSY-C2hq6aXTq7FzfC9z4n6i3fs3qTWNpbAfB4xUu3wayg/exec";

const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    
    if (document.getElementById("booking-hp").value) {
      return;
    }

    const statusEl = document.getElementById("booking-status");
    const submitBtn = document.getElementById("booking-submit");

    const data = {
      name: document.getElementById("booking-name").value,
      email: document.getElementById("booking-email").value,
      phone: document.getElementById("booking-phone").value,
      service: document.getElementById("service-type").value,
      date: document.getElementById("booking-date").value,
      message: document.getElementById("booking-notes").value,
    };

    if (!data.name || !data.email) {
      statusEl.textContent = "Please fill in your name and email.";
      statusEl.style.color = "orange";
      return;
    }

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    statusEl.textContent = "";

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Bad response: " + res.status);
        statusEl.textContent = "Thanks — your inquiry has been sent!";
        statusEl.style.color = "#388b9d";
        document.getElementById("booking-form").reset();
        submitBtn.textContent = "Send Inquiry →";
        submitBtn.disabled = false;
      })
      .catch(() => {
        statusEl.textContent = "Something went wrong, please try again.";
        statusEl.style.color = "red";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Inquiry →";
      });
  });
}


 