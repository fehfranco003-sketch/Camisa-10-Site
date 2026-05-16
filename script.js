const products = [
  {
    id: 1,
    name: "Chuteira Campo Pro Strike",
    category: "Chuteiras",
    price: 289.9,
    badge: "Campo",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Chuteira Society Velocity",
    category: "Chuteiras",
    price: 249.9,
    badge: "Society",
    image:
      "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Manto Jogo Camisa 10",
    category: "Mantos",
    price: 129.9,
    badge: "Dry fit",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Manto Treino Performance",
    category: "Mantos",
    price: 99.9,
    badge: "Leve",
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Manguito Compressao Black",
    category: "Manguitos",
    price: 39.9,
    badge: "Protecao",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Manguito UV Branco",
    category: "Manguitos",
    price: 34.9,
    badge: "UV",
    image:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Meiao Esportivo Elite",
    category: "Acessorios",
    price: 29.9,
    badge: "Jogo",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Caneleira Flex Guard",
    category: "Acessorios",
    price: 49.9,
    badge: "Protecao",
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80",
  },
];

const WHATSAPP_NUMBER = "5500000000000";
const WHATSAPP_MESSAGE =
  "Ola, vim pelo site da Camisa 10 e quero fazer um orcamento de confeccao de camisas e shorts para meu time.";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const state = {
  category: "Todos",
  search: "",
  sort: "featured",
  cart: [],
};

let nextCartId = 1;

const productGrid = document.querySelector("#productGrid");
const productCount = document.querySelector("#productCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const filterButtons = document.querySelectorAll("[data-category]");
const categoryLinks = document.querySelectorAll("[data-category-link]");
const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector("#cartPanel");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const whatsappLinks = document.querySelectorAll("#whatsappMain, #whatsappOffer");

function getVisibleProducts() {
  const search = state.search.trim().toLowerCase();
  let visible = products.filter((product) => {
    const matchesCategory =
      state.category === "Todos" || product.category === state.category;
    const matchesSearch = product.name.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  if (state.sort === "price-low") {
    visible = [...visible].sort((a, b) => a.price - b.price);
  }

  if (state.sort === "price-high") {
    visible = [...visible].sort((a, b) => b.price - a.price);
  }

  return visible;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productCount.textContent = `${visibleProducts.length} produto${
    visibleProducts.length === 1 ? "" : "s"
  }`;

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.badge}</span>
            </div>
            <h3>${product.name}</h3>
            <div class="price">${currency.format(product.price)}</div>
            <button class="add-button" type="button" data-add="${product.id}">
              Adicionar ao carrinho
            </button>
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
  renderProducts();
}

function renderCart() {
  cartCount.textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = currency.format(total);

  if (state.cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho esta vazio.</p>';
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <strong>${item.name}</strong>
            <span>${currency.format(item.price)}</span>
          </div>
          <button type="button" class="filter-chip" data-remove="${item.cartId}">
            Remover
          </button>
        </div>
      `
    )
    .join("");
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find((item) => item.id === Number(button.dataset.add));
  state.cart.push({ ...product, cartId: String(nextCartId) });
  nextCartId += 1;
  renderCart();
  cartPanel.classList.add("is-open");
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  state.cart = state.cart.filter((item) => item.cartId !== button.dataset.remove);
  renderCart();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => setCategory(link.dataset.categoryLink));
});

cartButton.addEventListener("click", () => cartPanel.classList.add("is-open"));
closeCart.addEventListener("click", () => cartPanel.classList.remove("is-open"));

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

whatsappLinks.forEach((link) => {
  link.href = whatsappUrl;
});

renderProducts();
renderCart();
