// collection.js - ID wala, coll ke baghair chalega
console.log("collection.js start");

// FILTER - Tabs
let allTabs = document.querySelectorAll('#tabs .tab');
let watchesLis = document.getElementById('watchesList');
let watchCards = document.querySelectorAll('#watchesList .watch-card');
let curIdx = document.getElementById('curIdx');
let totalCount = document.getElementById('totalCount');

console.log("Tabs mile: " + allTabs.length);
console.log("Cards mile: " + watchCards.length);

function showCategory(cat) {
  console.log("Filter daba: " + cat);

  for (let i = 0; i < allTabs.length; i++) {
    if (allTabs[i].dataset.filter === cat) {
      allTabs[i].classList.add('on');
    } else {
      allTabs[i].classList.remove('on');
    }
  }

  let shown = 0;
  for (let i = 0; i < watchCards.length; i++) {
    if (cat === 'all' || watchCards[i].dataset.cat === cat) {
      watchCards[i].style.display = '';
      shown = shown + 1;
    } else {
      watchCards[i].style.display = 'none';
    }
  }
  if (curIdx) curIdx.textContent = '01';
  if (totalCount) totalCount.textContent = String(shown).padStart(2, '0');
  if (watchesLis) watchesLis.scrollTo({ left: 0, behavior: 'smooth' });
}


// NAVBAR - Men, Women, Vintage, Smart, Wall
let menuLinks = document.querySelectorAll('[data-go-filter]');
for (let i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener('click', function (e) {
    let cat = this.dataset.goFilter;
    if (!cat) return;
    e.preventDefault();
    document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { showCategory(cat); }, 600);
  });
}
