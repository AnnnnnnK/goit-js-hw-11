import { serviceImages, imgPerPage } from "./js/search";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

console.log(serviceImages());

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};


refs.btnLoadMore.classList.add('hidden');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

console.log(refs.form);

refs.form.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', onloadMore);

function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  refs.list.innerHTML = '';
    searchQuery = evt.currentTarget.elements.searchQuery.value;
  
  serviceImages(searchQuery, page)
      .then(response => {
        console.log(response);
      if (response.total === 0) {
        Notify.failure('Sorry, there are no images. Please try again');
      }

            const el = response.hits;
          console.log(response);
      return createMarkup(response);
    })
    .catch(err => console.log(err));
}

function onloadMore() {
  page += 1;
  serviceImages(searchQuery, page)
    .then(data => {
        refs.list.insertAdjacentHTML('beforeend', createMarkup(data));
        

        if (data.totalHits / imgPerPage <= page) {
            Notify.info("We're sorry, but you've reached the end of search results.");
            console.log(refs.btnLoadMore);
            refs.btnLoadMore.classList.add('hidden');
      }
    })
    .catch(err => console.log(err));
}

function createMarkup(array) {
    console.log(array.hits);
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
          <b>Likes: </b><span class="numbers">${likes}</span>
        </p>
        <p class="info-item">
          <b>Views: </b><span class="numbers">${views}</span>
        </p>
        <p class="info-item">
          <b>Comments: </b><span class="numbers">${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads: </b><span class="numbers">${downloads}</span>
        </p>
      </div>
      </a>
    </div>
    `;
    })
    .join('');

    refs.list.insertAdjacentHTML('beforeend', resp);
  
    lightbox.refresh();
    if (array.totalHits > imgPerPage) {
    Notify.success(`Hooray! We found ${array.totalHits} images.`);
    refs.btnLoadMore.classList.remove('hidden');
  }
}