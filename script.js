// Year auto update
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn.addEventListener("click", () => {
  mobileNav.style.display = mobileNav.style.display === "flex" ? "none" : "flex";
});

// Close mobile nav when clicking link
document.querySelectorAll(".m-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.style.display = "none";
  });
});

// Navbar active section highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// Contact form submission to backend
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get inputs
  const inputs = contactForm.querySelectorAll('input, textarea');
  const name = inputs[0].value;
  const email = inputs[1].value;
  const message = inputs[2].value;

  // Change button state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      formNote.textContent = "Message sent successfully!";
      formNote.style.color = "#10b981"; // Success green
      contactForm.reset();
    } else {
      throw new Error('Server returned an error');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    formNote.textContent = "Failed to send message. Is the server running?";
    formNote.style.color = "#ef4444"; // Error red
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    setTimeout(() => {
      formNote.textContent = "";
    }, 5000);
  }
});