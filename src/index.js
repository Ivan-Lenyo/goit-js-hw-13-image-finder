import './sass/main.scss';
import pictureCard from './templates/picture-card.hbs';
import apiService from './js/apiService.js';
import { error } from "../node_modules/@pnotify/core/dist/PNotify.js";
import "@pnotify/core/dist/BrightTheme.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    pictureContainer: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
};

const newApiService = new apiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();

  newApiService.query = e.currentTarget.elements.query.value;

  if (newApiService.query === '') {
    return error({
        text: 'Empty field, enter search!'
    });
  }

  newApiService.resetPage();
  clearPicturesContainer();
  fetchPictures();
}

function fetchPictures() {
    newApiService.fetchPictures().then(pictures => {
        if (pictures.length === 0) {
            clearPicturesContainer();
            return error({
        text: 'Sorry, no pictures with this search, enter another!'
    });
        };
    appendPicturesMarkup(pictures);
      newApiService.incrementPage();
  });
}

function appendPicturesMarkup(pictures) {
  refs.pictureContainer.insertAdjacentHTML('beforeend', pictureCard(pictures));
}

function clearPicturesContainer() {
    refs.pictureContainer.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newApiService.query !== '') {
      newApiService.fetchPictures().then(pictures => {
        appendPicturesMarkup(pictures);
        newApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(refs.sentinel);

(function() {
  'use strict';

  function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('back_to_top-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  var goTopBtn = document.querySelector('.back_to_top');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
})();