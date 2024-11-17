let recipes = [];

// User data management functions
function getUserData() {
    const defaultUserData = {
        username: 'Guest',
        profilePicture: 'images/default-profile.jpg'
    };

    try {
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            console.log('No user data found in localStorage');
            return defaultUserData;
        }

        const userData = JSON.parse(storedUserData);
        return {
            username: userData.username || defaultUserData.username,
            profilePicture: userData.profilePicture || defaultUserData.profilePicture
        };
    } catch (error) {
        console.error('Error loading user data:', error);
        return defaultUserData;
    }
}

function updateUserData(username, profilePicture) {
    try {
        const userData = {
            username,
            profilePicture
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
}


// Function to search recipes by name
function searchRecipes() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm) || recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
        const matchesCategory = selectedCategory === "" || recipe.category === selectedCategory;
        return matchesSearchTerm && matchesCategory;
    });
    displayRecipes(filteredRecipes);
}

// Function to filter recipes by category
function filterByCategory() {
    searchRecipes(); // Re-run searchRecipes to apply the category filter
}

// Function to display recipes
function displayRecipes(recipesToDisplay) {
    const recipeContainer = document.getElementById("recipeContainer");
    recipeContainer.innerHTML = "";

    if (recipesToDisplay.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipesToDisplay.forEach(recipe => {
        const recipeItem = document.createElement("div");
        recipeItem.classList.add("recipe-item");
        recipeItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <a href="recipePage.html?id=${recipe.id}" class="read-more">Read More</a><br>
            <button onclick="deleteRecipe(${recipe.id})" class="delete-button">Delete</button>
            <button onclick="openReviews(${recipe.id})" class="delete-button">Reviews</button>
        `;
        recipeContainer.appendChild(recipeItem);
    });
}

function addRecipe(event) {
    event.preventDefault();

    const { username, profilePicture } = getUserData();

        
    const name = document.getElementById("recipeName").value;
    const description = document.getElementById("description").value;
    const ingredients = document.getElementById("ingredients").value.split(";").map(item => item.trim());
    const instructions = document.getElementById("instructions").value.split(";").map(item => item.trim());
    const youtubeLink = document.getElementById("youtubeLink").value;
    const category = document.getElementById("category").value;
    // const reviews = document.getElementById("reviews").value;
    // const reviewsList = reviews.split("\n");

    // Extract YouTube video ID
    let videoId = "";
    const youtubeRegex = /[?&]v=([^&]+)/;
    const match = youtubeLink.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    } else {
        alert("Please enter a valid YouTube link.");
        return;
    }

    // Generate embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    // Handle image input and convert to Base64
    const imageFile = document.getElementById("imageUpload").files[0];
    if (!imageFile) {
        alert("Please select an image for the recipe.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageBase64 = e.target.result;

        // Create new recipe object
        const newRecipe = {
            id: Date.now(),
            name,
            description,
            image: imageBase64,
            videoUrl: embedUrl,
            ingredients,
            instructions,
            category,
            reviews: [],
            userName: username,
            userProfile: profilePicture,
            dateCreated: new Date().toISOString()
        };

        recipes.unshift(newRecipe); // Add the new recipe to the beginning of the array
        addRecipeToIndexedDB(newRecipe); // Add the new recipe to IndexedDB
        closeUploadModal();
        document.getElementById("uploadForm").reset();
        displayRecipes(recipes);
        //window.confirm("Recipe added, refresh your window if it's didn't appear!");
    };

    // Read file as Data URL (Base64)
    reader.readAsDataURL(imageFile);
}

// Function to open reviews window
function openReviews(recipeId) {
    const reviewsWindow = window.open("", "Reviews", "width=800,height=800");
    const recipe = recipes.find(r => r.id === recipeId);
    
    const reviewsContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reviews for ${recipe.name}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .review-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .stars {
                    font-size: 24px;
                    color: #ddd;
                    cursor: pointer;
                    margin: 10px 0;
                }
                .stars .star {
                    padding: 0 2px;
                }
                .stars .star.active {
                    color: #ffd700;
                }
                textarea {
                    width: 100%;
                    height: 100px;
                    margin: 10px 0;
                    padding: 8px;
                }
                button {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    cursor: pointer;
                    margin-top: 10px;
                }
                button:hover {
                    background-color: #45a049;
                }
                .delete-review {
                    background-color: #ff4444;
                    float: right;
                }
                .delete-review:hover {
                    background-color: #cc0000;
                }
                .review-item {
                    border-bottom: 1px solid #ccc;
                    padding: 15px 0;
                    margin: 10px 0;
                    position: relative;
                }
                .review-item img {
                    max-width: 200px;
                    margin: 10px 0;
                }
                .star-rating {
                    color: #ffd700;
                    margin: 5px 0;
                }
                #imagePreview {
                    margin: 10px 0;
                }
                .username {
                    font-weight: bold;
                    color: #333;
                }
                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .review-date {
                    color: #666;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="review-container">
                <h2>Write a Review for ${recipe.name}</h2>
                
                <p id="usernameDisplay" class="username">Username: ${localStorage.getItem('username') || 'Anonymous'}</p>
                
                <div class="stars">
                    <span class="star" data-value="1">&#9733;</span>
                    <span class="star" data-value="2">&#9733;</span>
                    <span class="star" data-value="3">&#9733;</span>
                    <span class="star" data-value="4">&#9733;</span>
                    <span class="star" data-value="5">&#9733;</span>
                </div>

                <label for="uploadImage">Upload an image (will be resized to 512x512px):</label>
                <input type="file" id="uploadImage" accept="image/*">
                <img id="imagePreview" style="max-width: 200px; display: none;">

                <textarea id="description" placeholder="Write your review..."></textarea>
                
                <button id="submitReview">Submit Review</button>

                <h3>Previous Reviews</h3>
                <div id="reviewsList">
                    ${recipe.reviews ? recipe.reviews.map((review, index) => `
                        <div class="review-item">
                            <div class="review-header">
                                <div>
                                    <p class="username">${review.username}</p>
                                    <div class="star-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                ${review.username === (localStorage.getItem('username') || 'Anonymous') ? 
                                    `<button class="delete-review" onclick="deleteReview(${recipeId}, ${index})">Delete</button>` 
                                    : ''}
                            </div>
                            ${review.image ? `<img src="${review.image}" alt="Review image">` : ''}
                            <p>${review.description}</p>
                        </div>
                    `).join('') : '<p>No reviews yet.</p>'}
                </div>
            </div>

            <script>
                // Star rating functionality
                let currentRating = 0;
                document.querySelectorAll('.star').forEach(star => {
                    star.addEventListener('mouseover', function() {
                        const value = this.dataset.value;
                        updateStars(value);
                    });
                    
                    star.addEventListener('click', function() {
                        currentRating = this.dataset.value;
                        updateStars(currentRating);
                    });
                });

                document.querySelector('.stars').addEventListener('mouseout', function() {
                    updateStars(currentRating);
                });

                function updateStars(value) {
                    document.querySelectorAll('.star').forEach(star => {
                        star.classList.toggle('active', star.dataset.value <= value);
                    });
                }

                // Image preview functionality
                document.getElementById('uploadImage').addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const img = document.getElementById('imagePreview');
                            img.src = e.target.result;
                            img.style.display = 'block';
                        }
                        reader.readAsDataURL(file);
                    }
                });

                // Delete review function
                function deleteReview(recipeId, reviewIndex) {
                    if (confirm('Are you sure you want to delete this review?')) {
                        window.opener.deleteRecipeReview(recipeId, reviewIndex);
                        location.reload();
                    }
                }

                // Submit review
                document.getElementById('submitReview').addEventListener('click', function() {
                    const description = document.getElementById('description').value;
                    const imageFile = document.getElementById('uploadImage').files[0];
                    const username = localStorage.getItem('username') || 'Anonymous';
                    
                    if (!currentRating) {
                        alert('Please select a rating');
                        return;
                    }
                    
                    if (!description.trim()) {
                        alert('Please write a review');
                        return;
                    }

                    if (imageFile) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            submitReviewWithImage(${recipeId}, {
                                username,
                                rating: currentRating,
                                description,
                                image: e.target.result,
                                date: new Date().toISOString()
                            });
                        };
                        reader.readAsDataURL(imageFile);
                    } else {
                        submitReviewWithImage(${recipeId}, {
                            username,
                            rating: currentRating,
                            description,
                            image: null,
                            date: new Date().toISOString()
                        });
                    }
                });

                function submitReviewWithImage(recipeId, reviewData) {
                    window.opener.updateReviews(recipeId, reviewData);
                    alert('Review submitted successfully!');
                    location.reload();
                }
            </script>
        </body>
        </html>
    `;
    
    reviewsWindow.document.write(reviewsContent);
}

// Function to update reviews
function updateReviews(recipeId, reviewData) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
        if (!recipe.reviews) {
            recipe.reviews = [];
        }
        recipe.reviews.unshift(reviewData); // Add new review at the beginning
        
        // Update in IndexedDB
        updateRecipeInDB(recipe);
    }
}

// Function to delete a review
function deleteRecipeReview(recipeId, reviewIndex) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe && recipe.reviews) {
        // Remove the review at the specified index
        recipe.reviews.splice(reviewIndex, 1);
        
        // Update in IndexedDB
        updateRecipeInDB(recipe);
    }
}

// Helper function to update recipe in IndexedDB
function updateRecipeInDB(recipe) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("recipeDB", 1);
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["recipes"], "readwrite");
            const objectStore = transaction.objectStore("recipes");
            const updateRequest = objectStore.put(recipe);
            
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject();
        };
        request.onerror = () => reject();
    });
}


// Function to delete a recipe with a confirmation prompt
function deleteRecipe(recipeId) {
    // Ask the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to delete this recipe?");
    
    if (isConfirmed) {
        recipes = recipes.filter(recipe => recipe.id !== recipeId);
        // If confirmed, proceed with deletion
        deleteRecipeFromIndexedDB(recipeId);
        displayRecipes(recipes);
        //window.confirm("Recipe deleted, refresh your window if it's didn't removed!");
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById("imagePreviewContainer");

    // Clear any existing preview image
    previewContainer.innerHTML = "";

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement("img");
            preview.src = e.target.result;
            preview.alt = "Recipe Image Preview";
            preview.style.width = "100%";
            preview.style.marginTop = "10px";

            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }
}

// Function to add a recipe to IndexedDB
function addRecipeToIndexedDB(recipe) {
    const request = indexedDB.open("recipeDB", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore("recipes", { keyPath: "id" });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["recipes"], "readwrite");
        const objectStore = transaction.objectStore("recipes");
        objectStore.add(recipe);
        recipes.unshift(recipe);
    };
}

// Function to delete a recipe from IndexedDB
function deleteRecipeFromIndexedDB(recipeId) {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["recipes"], "readwrite");
        const objectStore = transaction.objectStore("recipes");
        const deleteRequest = objectStore.delete(recipeId);

        deleteRequest.onsuccess = function() {
            recipes = recipes.filter(recipe => recipe.id !== recipeId);
        };
    };
}

// Function to load recipes from IndexedDB on page load
function loadRecipesFromIndexedDB() {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["recipes"], "readonly");
        const objectStore = transaction.objectStore("recipes");
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function() {
            recipes = getAllRequest.result;
            displayRecipes(recipes);
        };
    };
}

// Load recipes from IndexedDB on page load
window.addEventListener('load', loadRecipesFromIndexedDB);

// Initial display of all recipes
displayRecipes(recipes);

// Function to open the upload modal
function openUploadModal() {
    document.getElementById("uploadModal").style.display = "block";
}

// Function to close the upload modal
function closeUploadModal() {
    document.getElementById("uploadModal").style.display = "none";
}



function submitReviews(){
    const reviews = document.getElementById("reviews").value;
}