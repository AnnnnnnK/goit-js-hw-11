import axios from 'axios';

let imgPerPage = 0;

async function serviceImages(searchQuery, page) {
  const resp = await axios(`https://pixabay.com/api/`, {
    params: {
      key: '40417349-5adf1a8a05d4c60245a4488c5',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  });
    imgPerPage = resp.config.params.per_page;
    console.log(resp.data);
  return resp.data;
}

export {serviceImages, imgPerPage}