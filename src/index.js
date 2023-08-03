import './styles.css';
import { searchPhoto } from './image-api'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const galleryImage = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const paramsForNotify = {
    position: 'center-center',
    timeout: 3000,
    width: '400px',
    fontSize: '24px'
};


const perPage = 40;
let page = 1;
let valueSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');

form.addEventListener('submit', handlerForm)

function handlerForm(evt) {
    evt.preventDefault()
    galleryImage.innerHTML = '';
    page = 1;
    //console.log(evt.currentTarget.elements)
    const { searchQuery } = evt.currentTarget.elements;
    valueSearchPhoto = searchQuery.value.trim().toLowerCase()
    console.log(valueSearchPhoto)
      if (valueSearchPhoto === '') {
        Notify.info('Enter your request, please!', paramsForNotify);
        return;
    }
 searchPhoto(valueSearchPhoto, page, perPage)
        .then(data => {
         const searchResults = data.hits;
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
            } else {
                Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
                console.log(searchResults);
                console.log(data.totalHits);
                createMarkup(searchResults);
                lightbox.refresh();

            };
            if (data.totalHits > perPage) {
                btnLoadMore.classList.remove('is-hidden');
                window.addEventListener('scroll', showLoadMorePage);
            };
            // scrollPage();
        })
        .catch(onFetchError);
     btnLoadMore.addEventListener('click', handlerLoadMore);
    evt.currentTarget.reset();
}

function createMarkup(searchResults) {
    const arrPhotos = searchResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
            <a class="gallery_link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        <div class="info">
            <p class="info-item">
            <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${downloads}</b>
            </p>
        </div>
        </div>`
    });
    galleryImage.insertAdjacentHTML("beforeend", arrPhotos.join(''));
};
function handlerLoadMore() {
    page += 1;
 
};
function onFetchError() {
    Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', paramsForNotify);
};

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250
  });