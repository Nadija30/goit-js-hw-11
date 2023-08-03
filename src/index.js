import './styles.css';
import { searchPhoto } from './image-api'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.search-form');
const galleryImage = document.querySelector('.gallery');
const button = document.querySelector('.load-more');


const perPage = 40;
let page = 1;
let valueSearchPhoto = '';
