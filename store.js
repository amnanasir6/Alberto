// ===== STORES - MAP WALA - EASY =====

// 1. Sab cheezein pakro
let sCards = document.querySelectorAll('#sGrid .s-card'); // Dono store wale cards
let sMap = document.getElementById('sMap'); // Upar wala Google Map
let sMapName = document.getElementById('sMapName'); // Map ke neeche store ka naam
let sMapAddr = document.getElementById('sMapAddr'); // Map ke neeche address
let sMapLink = document.getElementById('sMapLink'); // Open in Google Maps wala link

// 2. Har card pe click lagao
for (let i = 0; i < sCards.length; i++) {
  sCards[i].addEventListener('click', function () {

    // 3. Pehle sab cards se gold / active hatao
    for (let j = 0; j < sCards.length; j++) {
      sCards[j].classList.remove('active');
    }

    // 4. Ab jis card pe click kiya, usko active karo
    this.classList.add('active');

    // 5. Map badlo - Is card wali location dikhao
    sMap.src = this.dataset.map;

    // 6. Map ke neeche naam badlo
    sMapName.textContent = this.dataset.name;

    // 7. Map ke neeche address badlo
    sMapAddr.textContent = this.dataset.addr;

    // 8. Google Maps wala link badlo
    sMapLink.href = this.dataset.link;
  });
}