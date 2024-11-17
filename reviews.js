// Display username from localStorage
const storedUsername = localStorage.getItem('username');
document.getElementById('usernameDisplay').textContent = storedUsername || 'No username found';

// Star Rating System
let selectedRating = 0;

const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        updateStarSelection();
    });
});

function updateStarSelection() {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= selectedRating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Image Upload and Validation
document.getElementById('uploadImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                // Resize the image to 512x512 if necessary
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 512;
                canvas.height = 512;

                // Draw the image onto the canvas with the desired size
                ctx.drawImage(img, 0, 0, 512, 512);

                // Convert the canvas to a data URL and set it as the preview
                document.getElementById('imagePreview').src = canvas.toDataURL();
                document.getElementById('imagePreview').style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }
});

// IndexedDB Setup
let db;

const openRequest = indexedDB.open('reviewsDB', 1);
openRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { autoIncrement: true });
    }
};

openRequest.onsuccess = function(event) {
    db = event.target.result;
    fetchReviewsFromIndexedDB(); // Load reviews after DB is opened
};

openRequest.onerror = function(event) {
    console.error('Error opening IndexedDB', event);
};

function saveReviewToIndexedDB(review) {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["reviews"], "readwrite");
        const objectStore = transaction.objectStore("reviews");
        objectStore.add(review);
    };

    request.onerror = function(event) {
        console.error("Error saving review:", event.target.error);
    };
}


function fetchReviewsFromIndexedDB(recipeId) {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["reviews"], "readonly");
        const objectStore = transaction.objectStore("reviews");

        const reviews = [];
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.recipeId === recipeId) {
                    reviews.push(cursor.value);
                }
                cursor.continue();
            } else {
                displayReviews(reviews); // Display the reviews for the given recipe
            }
        };

        cursorRequest.onerror = function(event) {
            console.error("Error fetching reviews:", event.target.error);
        };
    };
}


// Display Reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = ''; // Clear current list

    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
    }

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        
        const reviewContent = document.createElement('div');
        reviewContent.classList.add('review-content');
        
        const rating = document.createElement('div');
        rating.classList.add('review-rating');
        rating.innerHTML = '★ '.repeat(review.stars); // Display stars
        
        const description = document.createElement('p');
        description.innerText = review.description;

        const username = document.createElement('p');
        username.classList.add('review-username');
        username.innerText = review.username; // Display the username

        reviewContent.appendChild(rating);
        reviewContent.appendChild(description);
        reviewContent.appendChild(username);
        
        if (review.image) {
            const image = document.createElement('img');
            image.src = review.image;
            image.style.maxWidth = '200px';
            reviewDiv.appendChild(image);
        }

        reviewDiv.appendChild(reviewContent);
        reviewsList.appendChild(reviewDiv);
    });
}


// Submit Review
document.getElementById('submitReview').addEventListener('click', function() {
    const description = document.getElementById('description').value;
    const review = {
        recipeId: recipeId, // Add the recipeId
        stars: selectedRating,
        description: description,
        image: document.getElementById('imagePreview').src, // You can store image URL or data here
        username: storedUsername || 'Anonymous' // Save the username with the review
    };

    if (description && selectedRating > 0) {
        saveReviewToIndexedDB(review);
        fetchReviewsFromIndexedDB(recipeId); // Fetch reviews for the specific recipe
        document.getElementById('description').value = ''; // Clear description
        document.getElementById('imagePreview').style.display = 'none'; // Hide image preview
    } else {
        alert('Please provide a description and a rating');
    }
});
