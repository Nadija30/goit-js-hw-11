import axios from "axios";
const URL ='https://pixabay.com/api/';
const KEY = '38622726-1d1c6ccd64174273156cb8786';


// axios.defaults.baseURL ='https://pixabay.com/api/';
// axios.defaults.headers.common["x-api-key"] = '38622726-1d1c6ccd64174273156cb8786';
const options = {
    image_type: "photo",
    orientation: "horizontal",
    safesearch:  "true",
}

export async function searchPhoto(q, page, perPage) {
    const url = axios.get (`${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
    const response = await axios.get(url);
    return response.data;          
};

