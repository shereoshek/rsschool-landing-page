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

if (menuGrid && menuCategories.length) {
  let products = []

  async function loadProducts() {
    try {
      const response = await fetch('./js/products.json')

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      products = await response.json()

      renderProducts('coffee')
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  function renderProducts(category) {
    const filteredProducts = products.filter(
      (product) => product.category === category,
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
  }

  menuCategories.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category

      menuCategories.forEach((item) => {
        item.classList.toggle('menu-category-active', item === button)
      })

      renderProducts(category)
    })
  })

  loadProducts()
}
