const state = { category: "all", search: "", cart: {} };

function fmt(n) {
  return "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function cardHTML(p) {
  const metaClass = p.tag === "CBD" ? "card-meta cbd" : "card-meta";
  const metaText = p.tag === "CBD" ? "CBD Wellness" : p.type;
  const thcText = `${p.thc}${p.pack ? " · " + p.pack : ""}`;
  const priceBlock = p.price
    ? `<div class="price">${fmt(p.price)}</div>`
    : `<div class="price">${fmt(p.pricePerG)}<small>per gram</small></div>`;
  const grade = p.grade ? `<span class="grade">${p.grade}</span>` : "";
  const imgClass = p.tag === "Greenhouse" ? "gh" : p.tag === "Indoor" ? "in" : p.tag === "Edibles" ? "ed" : "cb";

  return `
    <article class="card" data-id="${p.id}">
      <div class="card-img ${imgClass}">
        <span class="badge">${p.tag}</span>
        ${grade}
        <img class="card-photo" src="images/${p.id}.jpg" alt="${p.name}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-range">${p.range}</div>
        <div class="card-name">${p.name}</div>
        <div class="${metaClass}">${metaText}</div>
        <div class="card-thc">${thcText}</div>
        <div class="card-desc">${p.desc}</div>
      </div>
      <div class="card-foot">
        ${priceBlock}
        <button class="add-btn" data-add="${p.id}" title="Add to basket">+</button>
      </div>
    </article>`;
}

function visibleProducts() {
  const q = state.search.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const catOk = state.category === "all" || p.tag === state.category;
    const searchOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.range.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q);
    return catOk && searchOk;
  });
}

function render() {
  const catsEl = document.getElementById("cats");
  catsEl.innerHTML = CATEGORIES.map(
    (c) =>
      `<button class="cat-pill ${state.category === c.id ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
  ).join("");

  const wrap = document.getElementById("sections");
  const list = visibleProducts();

  if (!list.length) {
    wrap.innerHTML = `<div class="empty">No products match “${state.search}”.</div>`;
    return;
  }

  if (state.category === "all") {
    const order = ["Greenhouse", "Indoor", "Edibles", "CBD"];
    wrap.innerHTML = order
      .map((tag) => {
        const items = list.filter((p) => p.tag === tag);
        if (!items.length) return "";
        return sectionHTML(tag, items);
      })
      .join("");
  } else {
    wrap.innerHTML = sectionHTML(state.category, list);
  }
}

function sectionHTML(tag, items) {
  const label = { Greenhouse: "Greenhouse Range", Indoor: "Indoor Range", Edibles: "Edibles", CBD: "CBD" }[tag];
  return `
    <h2 class="section-title">${label} <span class="tag">${tag}</span></h2>
    <div class="grid">${items.map(cardHTML).join("")}</div>`;
}

function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const unit = p.price || p.pricePerG;
  if (!state.cart[id]) state.cart[id] = { product: p, qty: 0, unit };
  state.cart[id].qty += 1;
  updateCart();
  showToast(`${p.name} added to basket`);
}

function updateCart() {
  const ids = Object.keys(state.cart);
  const count = ids.reduce((s, id) => s + state.cart[id].qty, 0);
  const total = ids.reduce((s, id) => s + state.cart[id].qty * state.cart[id].unit, 0);
  document.getElementById("cartCount").textContent = `${count} item${count === 1 ? "" : "s"}`;
  document.getElementById("cartTotal").textContent = fmt(total);
  document.getElementById("checkoutBtn").disabled = count === 0;
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-cat]");
  if (cat) {
    state.category = cat.dataset.cat;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const add = e.target.closest("[data-add]");
  if (add) {
    addToCart(add.dataset.add);
    return;
  }
  if (e.target.id === "checkoutBtn") {
    showToast("Checkout is a demo — happy trails! 🌿");
  }
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.search = e.target.value;
  render();
});

render();
