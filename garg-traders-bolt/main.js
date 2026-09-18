import './style.css'

const FEATURED_PRODUCTS = [
  { name: 'Pilgrim Keratin & Amazonian Patua Smoothening Conditioner (200ml)', price: 'Rs. 695.00', img: 'https://images.pexels.com/photos/12538690/pexels-photo-12538690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Wella Professionals Koleston Perfect Medium Blonde Brown (7/7) [60g]', price: 'Rs. 1,250.00', img: 'https://images.pexels.com/photos/1327689/pexels-photo-1327689.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Korean Rice Water & Collagen Damage Repair Conditioner (200ml)', price: 'Rs. 695.00', img: 'https://images.pexels.com/photos/11935634/pexels-photo-11935634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Spanish Rosemary & Biotin Anti-Hairfall Conditioner (200ml)', price: 'Rs. 695.00', img: 'https://images.pexels.com/photos/7691165/pexels-photo-7691165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Redensyl & Anagain Hairfall Control Conditioner (200ml)', price: 'Rs. 745.00', img: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Spanish Rosemary Anti-Hairfall Hair Mask (200g)', price: 'Rs. 595.00', img: 'https://images.pexels.com/photos/1213558/pexels-photo-1213558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Argan Oil Deep Nourish Hair Mask (200ml)', price: 'Rs. 595.00', img: 'https://images.pexels.com/photos/30408335/pexels-photo-30408335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Pilgrim Korean Rice Water & Collagen Damage Repair Hair Mask (200gm)', price: 'Rs. 595.00', img: 'https://images.pexels.com/photos/2535913/pexels-photo-2535913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
]

let cart = []
let currentSlide = 0
let slideInterval = null

function initSlider() {
  const slides = document.querySelectorAll('.hero-slide')
  const dots = document.querySelectorAll('.slider-dot')
  const prevBtn = document.getElementById('sliderPrev')
  const nextBtn = document.getElementById('sliderNext')

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active')
    dots[currentSlide].classList.remove('active')
    currentSlide = (index + slides.length) % slides.length
    slides[currentSlide].classList.add('active')
    dots[currentSlide].classList.add('active')
  }

  function nextSlide() { goToSlide(currentSlide + 1) }
  function prevSlide() { goToSlide(currentSlide - 1) }

  function startAutoSlide() { slideInterval = setInterval(nextSlide, 5000) }
  function stopAutoSlide() { clearInterval(slideInterval) }

  prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide() })
  nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide() })
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.dot))
      stopAutoSlide()
      startAutoSlide()
    })
  })

  startAutoSlide()
}

function initCart() {
  const cartBtn = document.getElementById('cartBtn')
  const cartClose = document.getElementById('cartClose')
  const cartOverlay = document.getElementById('cartOverlay')
  const cartDrawer = document.getElementById('cartDrawer')
  const checkoutBtn = document.getElementById('checkoutBtn')

  function openCart() {
    cartDrawer.classList.add('open')
    cartOverlay.classList.add('open')
  }

  function closeCart() {
    cartDrawer.classList.remove('open')
    cartOverlay.classList.remove('open')
  }

  cartBtn.addEventListener('click', openCart)
  cartClose.addEventListener('click', closeCart)
  cartOverlay.addEventListener('click', closeCart)

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return
    showToast('Order placed successfully!')
    cart = []
    updateCartUI()
    setTimeout(closeCart, 1000)
  })

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart-btn')
    if (addBtn) {
      e.stopPropagation()
      const index = parseInt(addBtn.dataset.productIndex)
      addToCart(FEATURED_PRODUCTS[index])
    }
  })
}

function addToCart(product) {
  cart.push(product)
  updateCartUI()
  showToast(`Added: ${product.name.substring(0, 30)}...`)
}

function removeFromCart(index) {
  cart.splice(index, 1)
  updateCartUI()
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge')
  const cartItems = document.getElementById('cartItems')
  const cartTotal = document.getElementById('cartTotal')
  const checkoutBtn = document.getElementById('checkoutBtn')

  cartBadge.textContent = cart.length

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <p>Your cart is empty</p>
      </div>
    `
    cartTotal.textContent = 'Rs. 0.00'
    checkoutBtn.disabled = true
    return
  }

  let total = 0
  cartItems.innerHTML = cart.map((item, i) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
    total += price
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">${item.price}</span>
        </div>
        <button class="cart-item-remove" data-remove-index="${i}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `
  }).join('')

  cartTotal.textContent = `Rs. ${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  checkoutBtn.disabled = false

  cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.dataset.removeIndex))
    })
  })
}

function showToast(message) {
  const toast = document.getElementById('toast')
  const toastMessage = document.getElementById('toastMessage')
  toastMessage.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2500)
}

function initHeaderScroll() {
  const header = document.getElementById('header')
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  })
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle')
  const navList = document.getElementById('navList')
  toggle.addEventListener('click', () => {
    navList.classList.toggle('mobile-open')
  })
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('mobile-open'))
  })
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  const searchBtn = document.getElementById('searchBtn')
  function handleSearch() {
    const query = searchInput.value.trim()
    if (query) {
      showToast(`Searching for: ${query}`)
      searchInput.value = ''
    }
  }
  searchBtn.addEventListener('click', handleSearch)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch()
  })
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  reveals.forEach(el => observer.observe(el))
}

function initCategoryClicks() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.category
      showToast(`Browsing: ${name}`)
    })
  })
}

initSlider()
initCart()
initHeaderScroll()
initMobileMenu()
initSearch()
initScrollReveal()
initCategoryClicks()
