
// 1. Section ko dhoondo
let sec = document.getElementById("signature");

// Agar section nahi mila to aage kuch mat karo
if (sec) {

    // 2. Saare numbers dhoondo
    let nums = sec.querySelectorAll(".sig-num");
    let counted = false; // pehle se gin liya? nahi

    // 3. Numbers ginne wala function
    function countUp() {
        for (let i = 0; i < nums.length; i++) {
            let el = nums[i];
            let to = Number(el.getAttribute("data-to"));
            let suf = el.getAttribute("data-suf");

            // Agar number nahi mila to isko chhor do
            if (!to) {
                continue;
            }
            // Agar suf nahi hai to khali rakho
            if (!suf) {
                suf = "";
            }

            // Har number ko alag se ginna hai
            startCounting(el, to, suf);
        }
    }

    // 4. Ek number ko 0 se le kar uski value tak ginna
    function startCounting(el, to, suf) {
        let start = 0;
        let timer = setInterval(function () {
            start = start + 1;
            el.textContent = start + suf;

            // Jab poora ho jaye to timer band kar do
            if (start >= to) {
                clearInterval(timer);
                el.textContent = to + suf;
            }
        }, 20); // har 20ms me 1 barhega
    }

    // 5. Scroll karne pe check karo - section dikh raha hai?
    function checkScroll() {
        // Section ki position lo
        let box = sec.getBoundingClientRect();

        // Agar section screen me aa gaya aur pehle nahi gina
        if (box.top < window.innerHeight && counted == false) {
            counted = true; // ab dobara mat ginna
            sec.classList.add("in"); // section ko dikhao
            countUp(); // ginna shuru karo
        }
    }

    // 6. Scroll hone pe har bar check karo
    window.addEventListener("scroll", checkScroll);

    // 7. Page khulte hi ek bar check karo
    checkScroll();
    let video = document.getElementById("sigVideo");
    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

}