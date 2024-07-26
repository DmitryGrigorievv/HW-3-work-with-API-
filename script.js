const apiKey = '_joAZF3NXVn2iuQ54cc33_qi8EoSlWMDd6bHX-EmPds'; 
const randomImage = 'https://api.unsplash.com/photos/random';
let currentImageId = null;
let likedImages = JSON.parse(localStorage.getItem('likedImages')) || {};

document.addEventListener('DOMContentLoaded', () => {
    loadRandomImage();
    document.getElementById('new-image-button').addEventListener('click', loadRandomImage);
    document.getElementById('like-button').addEventListener('click', toggleLike);

    displayHistory();
});

async function loadRandomImage() {
    try {
        const response = await fetch(`${randomImage}?client_id=${apiKey}`);
        if (!response.ok) throw new Error('Ошибка загрузки изображения.');
        const imageData = await response.json();
        displayImage(imageData);
        saveToHistory(imageData);
    } catch (error) {
        console.error(error);
    }
}
function displayImage(imageData) {
    const imgElement = document.getElementById('random-image');
    const photographerName = document.getElementById('photographer-name');
    const photographerLink = document.getElementById('photographer-link');
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');

    imgElement.src = imageData.urls.regular;
    photographerName.textContent = imageData.user.name;
    photographerLink.href = imageData.user.links.html;
    photographerLink.textContent = `Профиль фотографа ${imageData.user.name}'`;

    currentImageId = imageData.id;
    updateLikeButton();

   
    likeCount.textContent = likedImages[currentImageId] || 0;
}

function updateLikeButton() {
    const likeButton = document.getElementById('like-button');
    if (likedImages[currentImageId]) {
        likeButton.innerHTML = '<i class="fas fa-heart"></i>'; 
    } else {
        likeButton.innerHTML = '<i class="far fa-heart"></i>'; 
    }
}

function toggleLike() {
    const likeCount = document.getElementById('like-count');
    if (likedImages[currentImageId]) {
        delete likedImages[currentImageId];
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
        likedImages[currentImageId] = (parseInt(likeCount.textContent) || 0) + 1;
        likeCount.textContent = likedImages[currentImageId];
    }

    localStorage.setItem('likedImages', JSON.stringify(likedImages));
    updateLikeButton();
}

function saveToHistory(imageData) {
    let history = JSON.parse(localStorage.getItem('viewedHistory')) || [];
    history.unshift({
        id: imageData.id,
        src: imageData.urls.thumb,
        photographer: imageData.user.name,
        photographerLink: imageData.user.links.html
    });
    localStorage.setItem('viewedHistory', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const historyContainer = document.getElementById('history-container');
    const history = JSON.parse(localStorage.getItem('viewedHistory')) || [];

    historyContainer.innerHTML = '';

    history.forEach(image => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-image';
        historyItem.innerHTML = `
            <img src="${image.src}" alt="History Image">
            <p>${image.photographer}</p>
            <a href="${image.photographerLink}" target="_blank">View Photographer</a>
        `;
        historyContainer.appendChild(historyItem);
    });
}