'use strict'

const burger = document.querySelector('.burger')
const navigation = document.querySelector('.navigation')

if (burger && navigation) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('burger-open')

    navigation.classList.toggle('navigation-open', isOpen)
    document.body.classList.toggle('menu-open', isOpen)
  })

  const navigationLinks = navigation.querySelectorAll('.navigation-link')

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('burger-open')
      navigation.classList.remove('navigation-open')
      document.body.classList.remove('menu-open')
    })
  })

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      navigation.classList.contains('navigation-open')
    ) {
      burger.classList.remove('burger-open')
      navigation.classList.remove('navigation-open')
      document.body.classList.remove('menu-open')
    }
  })
}

const themeSwitch = document.querySelector('.theme-switch')
const logo = document.querySelector('.header-logo img')
const moonIcon = document.querySelector('.theme-switch-dark img')

function setTheme(theme) {
  const isDark = theme === 'dark'

  document.body.classList.toggle('dark-theme', isDark)

  if (logo) {
    logo.src = isDark ? './img/logo-dark.png' : './img/logo.png'
  }

  if (moonIcon) {
    moonIcon.src = isDark
      ? './img/icons/Moon-hover.svg'
      : './img/icons/Moon.svg'
  }

  localStorage.setItem('theme', theme)
}

const savedTheme = localStorage.getItem('theme')

setTheme(savedTheme === 'dark' ? 'dark' : 'light')

themeSwitch?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme')

  setTheme(isDark ? 'light' : 'dark')
})

const slider = document.querySelector('.favorite-slider')

if (slider) {
  const viewport = slider.querySelector('.favorite-viewport')
  const track = slider.querySelector('.favorite-track')
  const slides = track?.querySelectorAll('.coffee-card')
  const prevButton = slider.querySelector('.slider-button-prev')
  const nextButton = slider.querySelector('.slider-button-next')
  const pagination = document.querySelector('.slider-pagination')
  const paginationItems = pagination?.querySelectorAll(
    '.slider-pagination-item',
  )

  if (viewport && track && slides?.length) {
    let currentSlide = 0

    function updateSlider() {
      const offset = currentSlide * viewport.clientWidth
      track.style.transform = `translateX(-${offset}px)`

      paginationItems?.forEach((item, index) => {
        item.classList.toggle(
          'slider-pagination-item-active',
          index === currentSlide,
        )
      })
    }

    function showNextSlide() {
      currentSlide = (currentSlide + 1) % slides.length
      updateSlider()
    }

    function showPrevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length
      updateSlider()
    }

    nextButton?.addEventListener('click', showNextSlide)
    prevButton?.addEventListener('click', showPrevSlide)

    paginationItems?.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentSlide = index
        updateSlider()
      })
    })

    window.addEventListener('resize', updateSlider)

    updateSlider()

    setInterval(showNextSlide, 5000)
  }
}

const menuGrid = document.querySelector('.menu-grid')
const menuCategories = document.querySelectorAll('.menu-category')
const loadMoreButton = document.querySelector('.load-more')

if (menuGrid && menuCategories.length && loadMoreButton) {
  let products = []
  let activeCategory = 'coffee'
  let isExpanded = false

  const initialCardsCount = 4

  async function loadProducts() {
    try {
      const response = await fetch('./js/products.json')

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      products = await response.json()
      renderProducts()
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  function renderProducts() {
    const filteredProducts = products.filter(
      (product) => product.category === activeCategory,
    )

    menuGrid.innerHTML = filteredProducts
      .map(
        (product) => `
          <article class="menu-card">
            <div class="menu-card-image-wrapper">
              <img
                class="menu-card-image"
                src="${product.image}"
                alt="${product.name}"
              />
            </div>

            <div class="menu-card-content">
              <h2 class="menu-card-title">${product.name}</h2>
              <p class="menu-card-description">${product.description}</p>
              <p class="menu-card-price">$${product.price}</p>
            </div>
          </article>
        `,
      )
      .join('')

    updateCardsVisibility()
  }

  function updateCardsVisibility() {
    const cards = menuGrid.querySelectorAll('.menu-card')
    const isMobile = window.innerWidth <= 768
    const visibleCount =
      isMobile && !isExpanded ? initialCardsCount : cards.length

    cards.forEach((card, index) => {
      card.style.display = index < visibleCount ? '' : 'none'
    })

    const hasHiddenCards = cards.length > initialCardsCount

    loadMoreButton.style.display =
      isMobile && hasHiddenCards && !isExpanded ? 'flex' : 'none'
  }

  menuCategories.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category
      isExpanded = false

      menuCategories.forEach((item) => {
        item.classList.toggle('menu-category-active', item === button)
      })

      renderProducts()
    })
  })

  loadMoreButton.addEventListener('click', () => {
    isExpanded = true
    updateCardsVisibility()
  })

  window.addEventListener('resize', updateCardsVisibility)

  loadProducts()

  //!!! Product modal

  const modal = document.querySelector('.modal-overlay')
  const modalImage = document.querySelector('.modal-image')
  const modalTitle = document.querySelector('.modal-title')
  const modalDescription = document.querySelector('.modal-description')
  const modalSizes = document.querySelector('.modal-size-options')
  const modalAdditives = document.querySelector('.modal-additives-options')
  const modalPrice = document.querySelector('.modal-price')
  const modalClose = document.querySelector('.modal-close')

  let currentProduct = null
  let selectedSize = 's'
  let previousBodyPaddingRight = ''
  let selectedAdditives = new Set()

  function updateModalPrice() {
    if (!currentProduct) return

    const basePrice = Number(currentProduct.price)
    const sizePrice = Number(currentProduct.sizes[selectedSize]['add-price'])

    const additivesPrice = [...selectedAdditives].reduce(
      (total, index) =>
        total + Number(currentProduct.additives[index]['add-price']),
      0,
    )

    modalPrice.textContent = `$${(
      basePrice +
      sizePrice +
      additivesPrice
    ).toFixed(2)}`
  }

  function renderModalOptions() {
    modalSizes.innerHTML = Object.entries(currentProduct.sizes)
      .map(
        ([key, size]) => `
          <button
            class="modal-option ${
              selectedSize === key ? 'modal-option-active' : ''
            }"
            type="button"
            data-size="${key}"
          >
            <span class="modal-option-icon">${key.toUpperCase()}</span>
            <span>${size.size}</span>
          </button>
        `,
      )
      .join('')

    modalAdditives.innerHTML = currentProduct.additives
      .map(
        (additive, index) => `
          <button
            class="modal-option ${
              selectedAdditives.has(index) ? 'modal-option-active' : ''
            }"
            type="button"
            data-additive="${index}"
          >
            <span class="modal-option-icon">${index + 1}</span>
            <span>${additive.name}</span>
          </button>
        `,
      )
      .join('')

    updateModalPrice()
  }

  function openModal(product) {
    currentProduct = product
    selectedSize = Object.keys(product.sizes)[0]
    selectedAdditives = new Set()

    modalImage.src = product.image
    modalImage.alt = product.name
    modalTitle.textContent = product.name
    modalDescription.textContent = product.description
    renderModalOptions()

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    previousBodyPaddingRight = document.body.style.paddingRight

    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.overflow = 'hidden'

    modal.hidden = false
  }

  function closeModal() {
    modal.hidden = true
    document.body.style.overflow = ''
    document.body.style.paddingRight = previousBodyPaddingRight
    currentProduct = null
  }

  menuGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.menu-card')

    if (!card) return

    const productName = card.querySelector('.menu-card-title')?.textContent
    const product = products.find(
      (item) => item.name === productName && item.category === activeCategory,
    )

    if (product) {
      openModal(product)
    }
  })

  modalSizes.addEventListener('click', (event) => {
    const button = event.target.closest('[data-size]')

    if (!button || !currentProduct) return

    selectedSize = button.dataset.size
    renderModalOptions()
  })

  modalAdditives.addEventListener('click', (event) => {
    const button = event.target.closest('[data-additive]')

    if (!button || !currentProduct) return

    const index = Number(button.dataset.additive)

    if (selectedAdditives.has(index)) {
      selectedAdditives.delete(index)
    } else {
      selectedAdditives.add(index)
    }

    renderModalOptions()
  })

  modalClose.addEventListener('click', closeModal)

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal()
    }
  })
}
