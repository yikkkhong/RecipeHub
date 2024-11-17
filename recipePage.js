const urlParams = new URLSearchParams(window.location.search);
const recipeId = parseInt(urlParams.get('id'));

let recipes = [];
loadRecipesFromIndexedDB(recipeId);

function loadRecipesFromIndexedDB(recipeId) {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["recipes"], "readonly");
        const objectStore = transaction.objectStore("recipes");
        const getRequest = objectStore.get(recipeId);

        getRequest.onsuccess = function() {
            const recipe = getRequest.result;
            if (recipe) {
                displayRecipeDetails(recipe);
            } else {
                document.getElementById("recipeDetail").innerHTML = "<p>Recipe not found.</p>";
            }
        };
    };
}

function loadRecipesFromIndexedDB_UserProfile(recipeId) {
    const request = indexedDB.open("recipeDB", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["recipes"], "readonly");
        const objectStore = transaction.objectStore("recipes");
        const getRequest = objectStore.get(recipeId);

        getRequest.onsuccess = function() {
            const recipe = getRequest.result;
            if (recipe) {
                openUserProfile(recipe);
            } else {
                document.getElementById("recipeDetail").innerHTML = "<p>Recipe not found.</p>";
            }
        };
    };
}

function displayRecipeDetails(recipe) {
    document.getElementById("recipeDetail").innerHTML = `
        <div class="recipe-image">
            <img src="${recipe.image}" alt="${recipe.name}">
        </div>
        
        <div class="content-section">
            <h1>${recipe.name} By </h1><h1><a href="javascript:loadRecipesFromIndexedDB_UserProfile(${recipe.id})">${recipe.userName}</a></h1>
            <p>${recipe.description}</p>
        </div>

        ${recipe.videoUrl ? `
        <div class="youtube-video">
            <iframe src="${recipe.videoUrl}" allowfullscreen></iframe>
        </div>` : ''}

        <div class="content-section" id="ingredients-section">
            <h2>Ingredients</h2>
            <div class="content" id="ingredients-content">
                <ul>${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
            </div>
            <button class="see-more" onclick="toggleContent('ingredients-content', this)">See More</button>
        </div>

        <div class="content-section" id="instructions-section">
            <h2>Instructions</h2>
            <div class="content" id="instructions-content">
               <ol>${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>
            </div>
        <button class="see-more" onclick="toggleContent('instructions-content', this)">See More</button>
        </div>

        <div class="content-section reviews">
            <h3>Reviews</h3>
            <div class="review" id="review1">
                <p><strong>User1:</strong> This curry is amazing! The squash adds a lovely sweetness, and the mushrooms are perfect. Highly recommend!</p>
            </div>
            <div class="review" id="review2">
                <p><strong>User2:</strong> I tried this recipe last night. It was very flavorful and easy to make. A definite keeper!</p>
            </div>
            <div class="review" id="review3">
                <p><strong>User3:</strong> I love this recipe! It’s perfect for a cozy dinner. The texture and flavors are just right.</p>
            </div>
        </div>

        <button class="see-more" onclick="window.history.back()">Back to Recipes</button>
    `;

    // Hide all reviews initially
    const reviews = document.querySelectorAll('.review');
    reviews.forEach(review => review.style.display = 'none');

    // Toggle content visibility for Ingredients and Instructions
    toggleContent('ingredients-content', document.querySelector('#ingredients-section .see-more'));
    toggleContent('instructions-content', document.querySelector('#instructions-section .see-more'));

    // Start showing reviews
    setInterval(showReviews, 3000);
    showReviews();
}

function openUserProfile(recipe) {
    const profileWindow = window.open("", "User Profile", "width=800, height=800");

    const profileContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Profile</title>
        <link rel="stylesheet" href="global.css">
        <style>
            /* Reset styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            /* Header styles */
            h3 {
                background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('images/UPBackground.jpeg');
                background-size: cover;
                background-position: center;
                height: 225px;
                color: white;
                text-align: center;
                line-height: 225px;
                font-size: 24px;
                font-weight: bold;
            }
            .user-profile {
                padding: 20px;
                max-width: 800px;
                margin: -50px auto 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .user-info img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid white;
            }
            .user-info h2 {
                font-size: 24px;
                margin: 0;
                display: flex;
                align-items: center;
            }
            .user-info h2 span {
                background-color: #007bff;
                color: white;
                border-radius: 50%;
                width: 14px;
                height: 14px;
                display: inline-block;
                margin-left: 5px;
            }
            .bio {
                margin-top: 15px;
                color: #555;
                font-size: 15px;
            }
            .links {
                margin-top: 15px;
                display: flex;
                gap: 10px;
            }
            .links a {
                text-decoration: none;
                color: #007bff;
                font-size: 14px;
                border: 1px solid #ddd;
                padding: 8px;
                border-radius: 4px;
            }
            .categories {
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .category {
                background-color: #f1f1f1;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                color: #333;
                cursor: pointer;
            }

                    /* Grid layout for additional boxes */
        .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px auto;
            max-width: 800px;
            padding: 20px;
            display: none; /* Initially hidden */
        }

        /* Reveal the grid container when the hidden class is removed */
        .grid-container.show {
            display: grid;
        }

        .grid-item {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: center;
            font-size: 16px;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0; /* Start transparent */
            transform: translateY(20px); /* Start slightly shifted down */
            animation: fadeInUp 0.6s forwards; /* Animation to fade in and move up */
        }

        /* Fade-in animation */
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Delays for sequential fade-in */
        .grid-item:nth-child(1) { animation-delay: 0.2s; }
        .grid-item:nth-child(2) { animation-delay: 0.4s; }
        .grid-item:nth-child(3) { animation-delay: 0.6s; }
        .grid-item:nth-child(4) { animation-delay: 0.8s; }
        .grid-item:nth-child(5) { animation-delay: 1s; }
        .grid-item:nth-child(6) { animation-delay: 1.2s; }

        /* Styling for images inside grid items */
        .grid-item img {
            width: 100%;
            height: auto;
            display: block;
            max-height: 150px; /* Limit height for uniformity */
            object-fit: cover;
        }

        /* Text section under each image */
        .grid-item .caption {
            padding: 10px;
            font-size: 14px;
            color: #333;
        }
        </style>
    </head>
    <body>
        <!-- Header -->
        <h3>User Profile</h3>
        
        <!-- Profile Section -->
        <section class="user-profile">
            <div class="user-info">
                <img src="${recipe.userProfile}" alt="Chef Profile Picture">
                <div>
                    <h2>${recipe.userName}<span>•</span></h2>
                    <p>Team Mateam</p>
                </div>
            </div>

            <!-- Bio Section -->
            <div class="bio">
                Seasonal, regional & 80% vegetarian - that's my approach. I'm happy if I can inspire you with my recipes.
            </div>

            <!-- Links Section -->
            <div class="links">
                <a href="https://www.Khunais.com">www.Khunais.com</a>
                <a href="#">Khunais food_vie</a>
                <a href="#">Channel/Khunais</a>
            </div>

            <!-- Categories Section -->
            <div class="categories">
                <div class="category" id="allCategories">Show Posted Recipe</div>
            </div>
        </section>

            <!-- Six Box Grid Layout with Images -->
    <div class="grid-container" id="gridContainer">
        <div class="grid-item">
            <img src="CurryPicture.jpeg" alt="Japanese Curry With Winter Squash and Mushrooms">
            <div class="caption">Japanese Curry With Winter Squash and Mushrooms</div>
        </div>
        <div class="grid-item">
            <img src="photo2.jpg" alt="Recipe 2">
            <div class="caption">Recipe 2</div>
        </div>
        <div class="grid-item">
            <img src="photo3.jpg" alt="Recipe 3">
            <div class="caption">Recipe 3</div>
        </div>
        <div class="grid-item">
            <img src="photo4.jpg" alt="Recipe 4">
            <div class="caption">Recipe 4</div>
        </div>
        <div class="grid-item">
            <img src="photo5.jpg" alt="Recipe 5">
            <div class="caption">Recipe 5</div>
        </div>
        <div class="grid-item">
            <img src="photo6.jpg" alt="Recipe 6">
            <div class="caption">Recipe 6</div>
        </div>
    </div>

        <script>
        // JavaScript to show the grid when "All Categories" is clicked
        document.getElementById("allCategories").addEventListener("click", function() {
            document.getElementById("gridContainer").classList.add("show");
        });
    </script>

    </body>
    </html>
    `;

    profileWindow.document.open();
    profileWindow.document.write(profileContent);
    profileWindow.document.close();
}


function toggleContent(sectionId, button) {
    const content = document.getElementById(sectionId);

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        button.textContent = 'See More';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        button.textContent = 'See Less';
    }
}

let reviewIndex = 0;
function showReviews() {
const reviews = document.querySelectorAll('.review');

// Hide all reviews and remove the 'show' class for the animation
reviews.forEach(review => {
review.classList.remove('show');
});

// Show the current review with animation
reviews[reviewIndex].style.display = 'block';
reviews[reviewIndex].classList.add('show');

// Update the index for the next review
reviewIndex = (reviewIndex + 1) % reviews.length;
}