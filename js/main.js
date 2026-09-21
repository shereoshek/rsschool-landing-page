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
