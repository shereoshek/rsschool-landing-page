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
