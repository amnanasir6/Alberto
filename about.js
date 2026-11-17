// ABOUT + SUPPORT -

// ===== ABOUT =====

let title = document.querySelector('.about-title');

// Jab heading screen me aaye to animation chalao
function checkAbout() {
  if (!title) return; // heading nahi hai to wapas

  let box = title.getBoundingClientRect();

  // Heading dikh gaya?
  if (box.top < window.innerHeight) {
    title.classList.add('play'); // animation on karo
    window.removeEventListener('scroll', checkAbout); // dobara check mat karo
  }
}

window.addEventListener('scroll', checkAbout);
checkAbout(); // page khulte hi check karo

// ===== SUPPORT - FAQ =====

// Sab FAQ button pakro
let faqButtons = document.querySelectorAll('.faq-q');

for (let i = 0; i < faqButtons.length; i++) {
  let btn = faqButtons[i];

  btn.addEventListener('click', function () {
    let item = btn.parentElement; // is button wala FAQ

    // Baqi sab band karo
    let allItems = document.querySelectorAll('.faq-item');
    for (let j = 0; j < allItems.length; j++) {
      if (allItems[j] !== item) {
        allItems[j].classList.remove('open');
      }
    }

    // Is wale ko kholo / band karo
    if (item.classList.contains('open')) {
      item.classList.remove('open');
    } else {
      item.classList.add('open');
    }
  });
}