const catalogs = [
  {
    id: 1,
    name: "Bolas de Vôlei",
    category: "Vôlei",
    badge: "Catálogo WhatsApp",
    description: "Modelos para treino, lazer e jogo.",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/p/8533288136683422/556792023030",
  },
  {
    id: 2,
    name: "Topper e Kagiva Campo e Society",
    category: "Campo e Society",
    badge: "Campo e society",
    description: "Bolas para campo, society e rotina de treino.",
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/p/24456481827288004/556792023030",
  },
  {
    id: 3,
    name: "Bolas de Futsal",
    category: "Futsal",
    badge: "Quadra",
    description: "Catálogo de bolas para futsal e jogo indoor.",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/p/7394343557264484/556792023030",
  },
  {
    id: 4,
    name: "Bolas de Basquete",
    category: "Basquete",
    badge: "Basquete",
    description: "Opções para quadra, treino e uso recreativo.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/p/24791141093871602/556792023030",
  },
];

const MERCADO_LIVRE_URL = "https://www.mercadolivre.com.br/pagina/camisa10esportes";
const WHATSAPP_NUMBER = "556792023030";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site da Camisa 10 e quero atendimento para consultar produtos.";

const state = {
  category: "Todos",
  search: "",
};

const productGrid = document.querySelector("#productGrid");
const productCount = document.querySelector("#productCount");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll("[data-category]");
const categoryLinks = document.querySelectorAll("[data-category-link]");
const whatsappLinks = document.querySelectorAll("#whatsappMain, #whatsappOffer, #whatsappConfection");
const marketplaceLinks = document.querySelectorAll("#mercadoLivreHero, #mercadoLivreStore");

function installMetaPixel() {
  const pixelId = window.META_PIXEL_ID;
  if (!pixelId) return;

  window.fbq =
    window.fbq ||
    function fbq() {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

function trackCatalogClick(catalog) {
  if (!window.fbq) return;
  window.fbq("trackCustom", "WhatsAppCatalogClick", {
    content_name: catalog.name,
    content_category: catalog.category,
  });
}


function trackMarketplaceClick(catalog) {
  if (!window.fbq) return;
  window.fbq("trackCustom", "MarketplaceClick", {
    marketplace: "Mercado Livre",
    content_name: catalog ? catalog.name : "Loja Camisa 10",
    content_category: catalog ? catalog.category : "Loja",
  });
}
function getVisibleCatalogs() {
  const search = state.search.trim().toLowerCase();

  return catalogs.filter((catalog) => {
    const matchesCategory =
      state.category === "Todos" || catalog.category === state.category;
    const matchesSearch = `${catalog.name} ${catalog.category} ${catalog.description}`
      .toLowerCase()
      .includes(search);
    return matchesCategory && matchesSearch;
  });
}

function renderCatalogs() {
  const visibleCatalogs = getVisibleCatalogs();
  productCount.textContent = `${visibleCatalogs.length} catálogo${
    visibleCatalogs.length === 1 ? "" : "s"
  }`;

  productGrid.innerHTML = visibleCatalogs
    .map(
      (catalog) => `
        <article class="product-card catalog-card">
          <div class="product-media">
            <img src="${catalog.image}" alt="${catalog.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${catalog.category}</span>
              <span>${catalog.badge}</span>
            </div>
            <h3>${catalog.name}</h3>
            <p>${catalog.description}</p>
            <div class="catalog-actions">
              <a class="catalog-cta marketplace-cta" href="${MERCADO_LIVRE_URL}" target="_blank" rel="noreferrer" data-marketplace="${catalog.id}">
                Ver no Mercado Livre
              </a>
              <a class="catalog-cta whatsapp-cta" href="${catalog.url}" target="_blank" rel="noreferrer" data-catalog="${catalog.id}">
                Ver no WhatsApp
              </a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function setCategory(category) {
  state.category = category;
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === category);
  });
  renderCatalogs();
}

productGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-catalog]");
  if (!link) return;

  const catalog = catalogs.find((item) => item.id === Number(link.dataset.catalog));
  if (catalog) trackCatalogClick(catalog);
});


productGrid.addEventListener("click", (event) => {
  const link = event.target.closest("[data-marketplace]");
  if (!link) return;

  const catalog = catalogs.find((item) => item.id === Number(link.dataset.marketplace));
  trackMarketplaceClick(catalog);
});
searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderCatalogs();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => setCategory(link.dataset.categoryLink));
});

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

whatsappLinks.forEach((link) => {
  link.href = whatsappUrl;
});

marketplaceLinks.forEach((link) => {
  link.href = MERCADO_LIVRE_URL;
  link.addEventListener("click", () => trackMarketplaceClick());
});

installMetaPixel();
renderCatalogs();
