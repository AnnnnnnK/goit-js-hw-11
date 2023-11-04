import { serviceImages, imgPerPage } from "./js/search";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let searchQuery = '';

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

// refs.btnLoadMore.classList.add('hidden');
// elements.btnLoad.classList.replace('load-more', 'hidden');


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});



refs.form.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', onloadMore);

function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  refs.list.innerHTML = '';
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  
  serviceImages(searchQuery, page)
      .then(response => {
      if (response.total === 0) {
        Notify.failure('Sorry, there are no images. Please try again');
        // refs.btnLoadMore.classList.remove('hidden');
      } else if (response.total > 0) {
        Notify.success(`Hooray! We found ${response.totalHits} images.`);
      }
      return createMarkup(response);
    })
    .catch(err => console.log(err));
}

function onloadMore() {
  page += 1;
  serviceImages(searchQuery, page)
    .then(data => {
         createMarkup(data);
        if (data.totalHits / imgPerPage <= page) {
          refs.btnLoadMore.classList.add('hidden');
          Notify.info("We're sorry, but you've reached the end of search results.");
          // elements.btnLoad.classList.replace('load-more-hidden', 'load-more');
      }
    })
    .catch(err => console.log(err));
}

function createMarkup(array) {
  const resp = array.hits
    .map(data => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        comments,
        views,
        downloads,
      } = data;
      return `<div class="photo-card">
        <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
      <div class="info">
        <p class="info-item">
          <b>Likes: </b>${likes}
        </p>
        <p class="info-item">
          <b>Views: </b>${views}
        </p>
        <p class="info-item">
          <b>Comments: </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads: </b>${downloads}
        </p>
      </div>
      </a>
    </div>
    `;
    })
    .join('');

    refs.list.insertAdjacentHTML('beforeend', resp);
  // refs.btnLoadMore.classList.remove('hidden');
  //  if (data.totalHits / imgPerPage <= page) {
    //     }
    // if (data.total > 0) {
    //     refs.btnLoadMore.classList.add('hidden');
    //   }
  // refs.btnLoad.classList.replace('hidden', 'load-more');
  
  lightbox.refresh();
}
