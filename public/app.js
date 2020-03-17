const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const carouselBody = document.querySelector('.habbit-proggres__calendar');

const carouselListeners = () => {
  let carouselPos = 0;
  const CAROUSEL_SHUFFLE_LENGTH = 287;
  const END_POS = 2583;
  nextBtn.addEventListener('click', () => {
    if (carouselPos < END_POS) {
      carouselPos += CAROUSEL_SHUFFLE_LENGTH;
    } else {
      carouselPos = 0;
    }
    carouselBody.style.transform = `translateX(-${carouselPos}px)`;
  });
  prevBtn.addEventListener('click', () => {
    if (carouselPos > 0) {
      carouselPos -= CAROUSEL_SHUFFLE_LENGTH;
    } else {
      carouselPos = END_POS;
    }
    carouselBody.style.transform = `translateX(-${carouselPos}px)`;
  });
};

carouselListeners();
