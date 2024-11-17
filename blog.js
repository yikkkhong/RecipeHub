// show pop up window
const modal = document.getElementById("modal");
const postButton = document.getElementById("postButton");
const closeModal = document.getElementById("closeModal");
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const photoGallery = document.getElementById("photoGallery");
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("deleteButton");

postButton.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});


const usernameInputField = document.getElementById("usernameInput");
const descriptionInputField = document.getElementById("descriptionInput");


// Open modal when post button is clicked
postButton.addEventListener("click", () => {
    modal.style.display = "block";
});

// Close modal when 'X' is clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Upload picture to photo gallery
uploadButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  const username = usernameInputField.value.trim();
  const description = descriptionInputField.value.trim();

  // Ensure all fields are filled out before uploading
  if (!file) {
    alert("Please select an image file.");
    return;
  }
  if (!username) {
    alert("Please enter a username.");
    return;
  }
  if (!description) {
    alert("Please enter a description.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    // Create the main container for the post
    const postContainer = document.createElement("div");
    postContainer.classList.add("post-container");

    // Create the username section
    const usernameDiv = document.createElement("div");
    usernameDiv.classList.add("username");

    const profilePicture = document.createElement("img");
    profilePicture.src = "images/profile-picture.jpg"; // Replace with actual profile picture path
    profilePicture.classList.add("profile-picture");

    const usernameText = document.createElement("span");
    usernameText.textContent = username;

    usernameDiv.appendChild(profilePicture);
    usernameDiv.appendChild(usernameText);

    // Create the photo gallery for the uploaded image
    const photoGalleryDiv = document.createElement("div");
    photoGalleryDiv.classList.add("photo-gallery");

    const newImage = document.createElement("img");
    newImage.src = e.target.result;
    newImage.classList.add("post-photo");

    // Add like functionality on double-click
    let likeCount = 0;
    const likesDisplay = document.createElement("span");
    likesDisplay.classList.add("likes");
    likesDisplay.textContent = `${likeCount} likes`; // Initial like count


    // Like Image Function
    newImage.addEventListener("dblclick", () => {
      likeCount += 1;
      likesDisplay.textContent = `${likeCount} likes`; // Update like count

      showLikeEffect(event.pageX, event.pageY);
    });

    photoGalleryDiv.appendChild(newImage);

    // Create the post details section (likes and description)
    const postDetails = document.createElement("div");
    postDetails.classList.add("post-details");

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("description");
    descriptionElement.innerHTML = `<strong>${username}</strong> ${description}`;

    postDetails.appendChild(likesDisplay);
    postDetails.appendChild(descriptionElement);


    // Create the Edit and Delete buttons
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      editPost(postContainer);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      deletePost(postContainer);
    });

    // Create a div to hold the buttons and add it to the post container
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("post-buttons");
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);
    

    // Append all sections to the main post container
    postContainer.appendChild(usernameDiv);
    postContainer.appendChild(photoGalleryDiv);
    postContainer.appendChild(postDetails);
    postContainer.appendChild(buttonsDiv);

    // Prepend the new post to the main photo gallery
    photoGallery.prepend(postContainer);

    // Clear input fields and close modal after uploading
    usernameInputField.value = '';
    descriptionInputField.value = '';
    fileInput.value = '';
    modal.style.display = "none";
  };
  reader.readAsDataURL(file);
});

function showLikeEffect(x, y)
{
  const image = document.createElement('img');

  image.src = "images/like_effect.png";

    // Set styles to position the image at the click location
    image.style.position = "absolute";
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.width = "100px"; // Example size
    image.style.height = "auto";

    // Append the image to the body
    document.body.appendChild(image);

    // Set a timeout to remove the image after 1 second
    setTimeout(() => {
        document.body.removeChild(image);
    }, 1000);
}


// Like Image Function
newImage.addEventListener("dblclick", (event) => {
  likeCount += 1;
  likesDisplay.textContent = `${likeCount} likes`; // Update like count

  // Call the showImageAtClick function to display the image at the double-click location
  showImageAtClick("images/like_effect.png", event.pageX, event.pageY);
});





// Close modal if user clicks outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});



// Click to close window (X button)
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// deleteButton.addEventListener("click", (event) => {
//   deletePost()
// })

// Function to delete the post
function deletePost(postContainer) {
  postContainer.remove();
  alert("Post has been deleted.");  // Alert to indicate post deletion
}

// Function to edit the post
function editPost(postContainer) {
  // Get current username, description, and image source
  const currentUsername = postContainer.querySelector(".username span").textContent;
  const currentDescription = postContainer.querySelector(".description").textContent.replace(/<strong>.*<\/strong>/, '').trim();
  // const currentImageSrc = postContainer.querySelector(".post-photo").src;

  // Prompt the user to edit the username and description
  const newUsername = prompt("Enter new username (leave blank to keep current):", currentUsername);
  const newDescription = prompt("Enter new description (leave blank to keep current):", currentDescription);

  // Update the username and description
  if (newUsername !== null) {
    postContainer.querySelector(".username span").textContent = newUsername.trim() || currentUsername;
  }

  if (newDescription !== null) {
    postContainer.querySelector(".description").innerHTML = `<strong>${newUsername.trim() || currentUsername}</strong> ${newDescription.trim() || currentDescription}`;
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------
function uploadPost(username, description, imagePath) {
  // Ensure all fields are filled out before uploading
  if (!username) {
    alert("Please enter a username.");
    return;
  }
  if (!description) {
    alert("Please enter a description.");
    return;
  }
  if (!imagePath) {
    alert("Please provide an image path.");
    return;
  }

  // Simulate the file upload process
  const file = { name: imagePath }; // Simulated file object (you can use an actual file object here if necessary)
  
  const reader = new FileReader();
  reader.onload = function (e) {
    // Create the main container for the post
    const postContainer = document.createElement("div");
    postContainer.classList.add("post-container");

    // Create the username section
    const usernameDiv = document.createElement("div");
    usernameDiv.classList.add("username");

    const profilePicture = document.createElement("img");
    profilePicture.src = "images/profile-picture.jpg"; // Replace with actual profile picture path
    profilePicture.classList.add("profile-picture");

    const usernameText = document.createElement("span");
    usernameText.textContent = username;

    usernameDiv.appendChild(profilePicture);
    usernameDiv.appendChild(usernameText);

    // Create the photo gallery for the uploaded image
    const photoGalleryDiv = document.createElement("div");
    photoGalleryDiv.classList.add("photo-gallery");

    const newImage = document.createElement("img");
    newImage.src = e.target.result; // Use the FileReader result as the image source
    newImage.classList.add("post-photo");

    let likeCount = 0;
    const likesDisplay = document.createElement("span");
    likesDisplay.classList.add("likes");
    likesDisplay.textContent = `${likeCount} likes`;

    newImage.addEventListener("dblclick", () => {
      likeCount += 1;
      likesDisplay.textContent = `${likeCount} likes`;
      showLikeEffect(event.pageX, event.pageY);
    });

    photoGalleryDiv.appendChild(newImage);

    // Create the post details section (likes and description)
    const postDetails = document.createElement("div");
    postDetails.classList.add("post-details");

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("description");
    descriptionElement.innerHTML = `<strong>${username}</strong> ${description}`;

    postDetails.appendChild(likesDisplay);
    postDetails.appendChild(descriptionElement);

    // Create the Edit and Delete buttons
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      editPost(postContainer);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      deletePost(postContainer);
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("post-buttons");
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    // Append all sections to the main post container
    postContainer.appendChild(usernameDiv);
    postContainer.appendChild(photoGalleryDiv);
    postContainer.appendChild(postDetails);
    postContainer.appendChild(buttonsDiv);

    // Prepend the new post to the photo gallery
    photoGallery.prepend(postContainer);

    // Optionally clear fields or close the modal if needed
  };

  // Simulate reading the image file (using a local path or image URL)
  reader.readAsDataURL({ name: imagePath });
}

const storedUsername = localStorage.getItem('username');
const storedProfile = localStorage.getItem('profile');

// Find the <p> element by its ID and set its content
document.getElementById('usernameDisplay').textContent = storedUsername || 'No username found';
document.getElementById('profileDisplay').src = storedProfile;