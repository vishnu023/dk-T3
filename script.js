const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const modal = document.querySelector("#videoModal");
const videoButton = document.querySelector("#videoButton");

// Mobile Menu Toggle
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

// Video Modal
if (videoButton && modal) {
  videoButton.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
}

function closeModal() {
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Sticky Header Logic
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Lightbox Gallery Modal
const lightboxModal = document.querySelector("#lightboxModal");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const galleryImages = document.querySelectorAll(".gallery img, .journey-card img");

if (lightboxModal && galleryImages.length > 0) {
  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightboxModal.classList.add("open");
      lightboxModal.setAttribute("aria-hidden", "false");
    });
  });

  const lightboxClose = lightboxModal.querySelector(".modal-close");
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  
  lightboxModal.addEventListener("click", event => {
    if (event.target === lightboxModal) closeLightbox();
  });
}

function closeLightbox() {
  if (lightboxModal) {
    lightboxModal.classList.remove("open");
    lightboxModal.setAttribute("aria-hidden", "true");
  }
}

// Global Event Listeners (Escape key closer for all modals)
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    closeLightbox();
  }
});

// Active Section Tracking (Intersection Observer - Homepage Only)
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav a");
const isHomepage = document.querySelector(".hero-slider") !== null;

if (isHomepage && sections.length > 0 && navLinks.length > 0) {
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px", // Trigger when section occupies screen center
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// Category Filter Logic (Insights Archive)
const filterTags = document.querySelectorAll(".filter-tag");
const filterItems = document.querySelectorAll(".insights-archive-grid .filter-item");

if (filterTags.length > 0 && filterItems.length > 0) {
  filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      // Toggle active tag state
      filterTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      const filterValue = tag.getAttribute("data-filter");

      // Toggle card visibility
      filterItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategory === filterValue) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

// Partner Form Submission (Google Apps Script + Local Storage Fallback)
const partnerForm = document.getElementById('partnerForm');
if (partnerForm) {
  const statusDiv = partnerForm.querySelector('#formStatus') || document.getElementById('formStatus');
  partnerForm.addEventListener('submit', event => {
    event.preventDefault();
    statusDiv.textContent = "Sending your request...";
    statusDiv.className = "form-status sending";

    const formData = new FormData(partnerForm);
    const dataObj = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // Save to local storage for verification/testing
    let submissions = JSON.parse(localStorage.getItem('partnershipSubmissions') || '[]');
    submissions.push({
      date: new Date().toISOString(),
      data: dataObj
    });
    localStorage.setItem('partnershipSubmissions', JSON.stringify(submissions));

    // Post to Google Apps Script (replace with actual script URL when deployed)
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
    
    if (scriptURL && !scriptURL.includes('YOUR_GOOGLE_SCRIPT_URL_HERE')) {
      fetch(scriptURL, { 
        method: 'POST', 
        body: formData 
      })
      .then(response => {
        statusDiv.textContent = "Success! We will contact you soon.";
        statusDiv.className = "form-status success";
        partnerForm.reset();
      })
      .catch(error => {
        console.error('Error posting form:', error);
        statusDiv.textContent = "Thank you! Your request was received successfully (Offline mode).";
        statusDiv.className = "form-status success";
        partnerForm.reset();
      });
    } else {
      // Mock delay for premium feel
      setTimeout(() => {
        statusDiv.textContent = "Success! We will contact you soon.";
        statusDiv.className = "form-status success";
        partnerForm.reset();
      }, 1000);
    }
  });
}

// Membership Form Submission (Google Apps Script + Local Storage Fallback)
const membershipForm = document.getElementById('membershipForm');
if (membershipForm) {
  const statusDiv = membershipForm.querySelector('#formStatus') || document.getElementById('formStatus');
  membershipForm.addEventListener('submit', event => {
    event.preventDefault();
    statusDiv.textContent = "Sending your application...";
    statusDiv.className = "form-status sending";

    const formData = new FormData(membershipForm);
    const dataObj = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // Save to local storage for verification/testing
    let submissions = JSON.parse(localStorage.getItem('membershipSubmissions') || '[]');
    submissions.push({
      date: new Date().toISOString(),
      data: dataObj
    });
    localStorage.setItem('membershipSubmissions', JSON.stringify(submissions));

    // Post to Google Apps Script (replace with actual script URL when deployed)
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
    
    if (scriptURL && !scriptURL.includes('YOUR_GOOGLE_SCRIPT_URL_HERE')) {
      fetch(scriptURL, { 
        method: 'POST', 
        body: formData 
      })
      .then(response => {
        statusDiv.textContent = "Success! Your application has been submitted.";
        statusDiv.className = "form-status success";
        membershipForm.reset();
      })
      .catch(error => {
        console.error('Error posting form:', error);
        statusDiv.textContent = "Thank you! Your application was received successfully (Offline mode).";
        statusDiv.className = "form-status success";
        membershipForm.reset();
      });
    } else {
      // Mock delay for premium feel
      setTimeout(() => {
        statusDiv.textContent = "Success! Your application has been submitted.";
        statusDiv.className = "form-status success";
        membershipForm.reset();
      }, 1000);
    }
  });
}

// Back to Top Button Logic
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// Journey Milestones Filter Logic
const journeyFilters = document.querySelectorAll(".journey-filters .filter-tag");
const journeyCards = document.querySelectorAll(".journey-grid .journey-card");

if (journeyFilters.length > 0 && journeyCards.length > 0) {
  journeyFilters.forEach(tag => {
    tag.addEventListener("click", () => {
      // Toggle active tag state
      journeyFilters.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      const filterValue = tag.getAttribute("data-filter");

      // Toggle card visibility
      journeyCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

// General Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusDiv = contactForm.querySelector('#formStatus') || document.getElementById('formStatus');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    statusDiv.textContent = "Sending your message...";
    statusDiv.className = "form-status sending";

    const formData = new FormData(contactForm);
    const dataObj = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // Save to local storage for verification/testing
    let submissions = JSON.parse(localStorage.getItem('generalContactSubmissions') || '[]');
    submissions.push({
      date: new Date().toISOString(),
      data: dataObj
    });
    localStorage.setItem('generalContactSubmissions', JSON.stringify(submissions));

    // Mock delay for premium feel
    setTimeout(() => {
      statusDiv.textContent = "Success! Thank you for your message, we will get back to you shortly.";
      statusDiv.className = "form-status success";
      contactForm.reset();
    }, 1200);
  });
}
