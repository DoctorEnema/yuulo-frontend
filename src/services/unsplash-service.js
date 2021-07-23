import axios from 'axios';
import { utilService } from './util-service';

const gPhotos = utilService.loadFromStorage('savedPhotos') || {}

// AXIOS

export const unsplashSearch = async (value) =>{
    try {
        if (gPhotos[value]) {
            const savedRes = gPhotos[value]
            console.log('loading from cache');
            return savedRes
        }
        const key = 'HxJnZbbOQY-YSo6K4RNhJ9Zhw7mZgTcSmOg_1LAT51o'
        const {data} = await axios.get(`https://api.unsplash.com/search/photos?orientation=landscape&page=1&per_page=12&query=${value}&client_id=${key}`)
        localStorage.setItem(`savedPhotos`, JSON.stringify(data))
        const res = data.results
        gPhotos[value] = res
        utilService.saveToStorage('savedPhotos', gPhotos)
        return data.results
    } catch (err) {
        console.log('cannot get photos', err);
    }
}