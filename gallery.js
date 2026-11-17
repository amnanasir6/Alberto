// ===== GALLERY - SIMPLE WALA - 18 PHOTOS =====

// 1. Sab cheezein pakro
let gTabs = document.querySelectorAll('#gTabs .g2-tab'); // Filter wale button
let gItems = document.querySelectorAll('#gGrid .g2-item'); // 18 photos
let gLightbox = document.getElementById('gLightbox'); // Bari photo wala dabba
let gBigImg = document.getElementById('gBigImg'); // Bari photo
let gBigText = document.getElementById('gBigText'); // Bari photo ka naam
let gCur = document.getElementById('gCur'); // Upar wala number - 18
let gIndex = 0; // Abhi kaunsi photo khuli hai

// 2. FILTER - Button dabao to photo badlo
function showGallery(cat) {
    // Button ko gold karo
    for (let i = 0; i < gTabs.length; i++) {
        if (gTabs[i].dataset.filter === cat) {
            gTabs[i].classList.add('on');
        } else {
            gTabs[i].classList.remove('on');
        }
    }

    // Photo dikhao ya chupao
    let shown = 0;
    for (let i = 0; i < gItems.length; i++) {
        if (cat === 'all' || gItems[i].dataset.cat === cat) {
            gItems[i].style.display = '';
            shown = shown + 1;
        } else {
            gItems[i].style.display = 'none';
        }
    }

    // Upar number badlo - 03, 06, 18
    if (gCur) {
        if (shown < 10) {
            gCur.textContent = '0' + shown;
        } else {
            gCur.textContent = shown;
        }
    }
}

// Har button pe click lagao
for (let i = 0; i < gTabs.length; i++) {
    gTabs[i].addEventListener('click', function () {
        showGallery(this.dataset.filter);
    });
}

// 3. PHOTO PE CLICK - Bari karo
for (let i = 0; i < gItems.length; i++) {
    gItems[i].addEventListener('click', function () {
        // Is photo ka number yaad rakho
        for (let j = 0; j < gItems.length; j++) {
            if (gItems[j] === this) {
                gIndex = j;
            }
        }
        // Bari photo me daalo
        gBigImg.src = this.querySelector('img').src;
        gBigText.textContent = this.querySelector('b').textContent;
        // Dabba kholo
        gLightbox.classList.add('open');
    });
}

// 4. AAGE / PEECHE - Lightbox wale arrow
function showNext(step) {
    // Aage ya peeche jao
    gIndex = gIndex + step;

    // Agar aakhri se aage gaya to pehli pe aa jao
    if (gIndex >= gItems.length) {
        gIndex = 0;
    }
    // Agar pehli se peeche gaya to aakhri pe chale jao
    if (gIndex < 0) {
        gIndex = gItems.length - 1;
    }

    // Nayi photo dikhao
    gBigImg.src = gItems[gIndex].querySelector('img').src;
    gBigText.textContent = gItems[gIndex].querySelector('b').textContent;
}

// 5. BAND KARO - Cross wala button
let gClose = document.getElementById('gClose');
gClose.addEventListener('click', function () {
    gLightbox.classList.remove('open');
});

// 6. AAGE WALA BUTTON - Next
let gNext = document.getElementById('gNext');
gNext.addEventListener('click', function (e) {
    e.stopPropagation(); // Dabba band na ho
    showNext(1); // 1 aage
});

// 7. PEECHE WALA BUTTON - Prev
let gPrev = document.getElementById('gPrev');
gPrev.addEventListener('click', function (e) {
    e.stopPropagation(); // Dabba band na ho
    showNext(-1); // 1 peeche
});

// 8. BAHAR CLICK KARO TO BAND HO JAYE
gLightbox.addEventListener('click', function (e) {
    if (e.target === gLightbox) {
        gLightbox.classList.remove('open');
    }
});

// ===== GALLERY - ADD TO CART + QUANTITY =====

// Har ek watch ka card dhoondo
document.querySelectorAll('.gallery2 .g2-item').forEach(item => {

    // Is card ke andar wale button dhoondo - SAHI WALA, : NAHI HAI
    const minusBtn = item.querySelector('.g2-qty-btn[data-action="minus"]');
    const plusBtn = item.querySelector('.g2-qty-btn[data-action="plus"]');
    const qtyNum = item.querySelector('.g2-qty-num');
    const addBtn = item.querySelector('.g2-add-btn');

    // Agar is card me ye cheezein nahi hain to aage mat jao
    if (!minusBtn || !plusBtn || !qtyNum || !addBtn) return;

    // --- 1. + DABANE PE ---
    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Card pe click na jaye, warna bari photo khul jayegi
        let qty = parseInt(qtyNum.textContent);
        if (isNaN(qty)) qty = 0;
        if (qty < 99) {
            qty++;
            qtyNum.textContent = qty;
        }
    });

    // --- 2. - DABANE PE ---
    minusBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Bari photo na khule
        let qty = parseInt(qtyNum.textContent);
        if (isNaN(qty)) qty = 0;
        if (qty > 0) { // 0 se neeche nahi jayega
            qty--;
            qtyNum.textContent = qty;
        }
    });

    // --- 3. ADD TO CART DABANE PE ---
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Bari photo na khule

        const name = item.querySelector('.g2-info b')?.textContent || 'Watch';
        let qty = parseInt(qtyNum.textContent);
        if (isNaN(qty)) qty = 0;

        if (qty === 0) {
            alert('Please Select the quantity first');
            return;
        }

        // Button pe thori der ke liye ADDED likh do
        const oldText = addBtn.textContent;
        addBtn.textContent = 'ADDED ✓';
        addBtn.style.background = '#F2E8D5';

        setTimeout(() => {
            addBtn.textContent = oldText;
            addBtn.style.background = ''; // Wapis gold ho jayega
        }, 2000); // 2 second baad wapis - pehle 10000 tha, 10 sec bht zyada tha

        // Quantity wapis 0 kar do
        qtyNum.textContent = 0;

        console.log(name + ' x ' + qty + ' cart me gaya');
    });

});