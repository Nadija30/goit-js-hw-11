import './styles.css';
import { searchPhoto } from './image-api'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const galleryImage = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const target = document.querySelector('.js-quard')

// let currentPage = 1;
// let options = {
//     root: null,
//     rootMargin: "300px",
//     threshold: 1.0,
// };
// let observer = new IntersectionObserver(onLoad, options); 
// function onLoad(entries, observer) {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             currentPage += 1;
//             searchPhoto(valueSearchPhoto, currentPage, perPage)
//                 .then(data => {
//                     const searchResults = data.hits;
//                     const numberOfPage = Math.ceil(data.totalHits / perPage);
//                     createMarkup(searchResults);
//                       if (currentPage === numberOfPage) {
//                         btnLoadMore.classList.add('is-hidden');
//                         Notify.info("Вибачте, але ви досягли кінця результатів пошуку.", paramsForNotify);
//                         btnLoadMore.removeEventListener('click', handlerLoadMore);
//                         observer.unobserve(target);
//                     };
//                 })
//                 .catch((err) => console.log(err))
//         }
//     });
// }

        const paramsForNotify = {
            position: 'center-center',
            timeout: 3000,
            width: '400px',
            fontSize: '24px'
        };


        const perPage = 40;
        let page = 1;
        let valueSearchPhoto = '';


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
                Notify.info('Введіть свій запит, будь ласка!', paramsForNotify);
                return;
            }
            searchPhoto(valueSearchPhoto, page, perPage)
                .then(data => {
                    const searchResults = data.hits;
                    if (data.totalHits === 0) {
                        btnLoadMore.classList.add('is-hidden');
                        Notify.failure('«На жаль, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.', paramsForNotify);
                    return
                    } else {
                        Notify.info(`Урааа! Ми знайшли ${data.totalHits} зображення.`, paramsForNotify);
                        console.log(searchResults);
                        console.log(data.totalHits);
                        createMarkup(searchResults);
                        //   observer.observe(target);
                        lightbox.refresh();

                    };
                    if (data.totalHits > perPage) {
                       btnLoadMore.classList.remove('is-hidden');
                    };
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
            searchPhoto(valueSearchPhoto, page, perPage)
                .then(data => {
                    const searchResults = data.hits;
                    const numberOfPage = Math.ceil(data.totalHits / perPage);
            
                    createMarkup(searchResults);
                    if (page === numberOfPage) {
                        btnLoadMore.classList.add('is-hidden');
                        Notify.info("Вибачте, але ви досягли кінця результатів пошуку.", paramsForNotify);
                        btnLoadMore.removeEventListener('click', handlerLoadMore);
                    };
                    lightbox.refresh();
                })
                .catch(onFetchError);
        };
        function onFetchError() {
            Notify.failure("Ой! Щось пішло не так! Спробуйте перезавантажити сторінку або зробіть інший вибір!', paramsForNotify");
        };

        const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250
        });