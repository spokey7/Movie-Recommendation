async function getRecommendation() {
    const movieName = document.getElementById("movie_input").value;
    const loadingDiv = document.getElementById("loading");
    const recommendationsDiv = document.getElementById("recommendations");
    
    // Show loading animation
    loadingDiv.style.display = "block";
    recommendationsDiv.innerHTML = ""; // Clear previous recommendations

    try {
        const recommendations = await eel.recommend_movie(movieName)();
        if (recommendations[0].length === 0) {
            recommendationsDiv.innerHTML = "<p>No results found</p>";
        } else {
            displayRecommendations(recommendations);
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        recommendationsDiv.innerHTML = "<p>Error fetching recommendations</p>";
    } finally {
        // Hide loading animation
        loadingDiv.style.display = "none";
    }
}

function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; // Clear previous recommendations
    recommendations[0].forEach((title, index) => {
        const poster = recommendations[1][index];
        recommendationsDiv.innerHTML += `<div>
            <img src="${poster}" alt="${title}">
            <p>${title}</p>
        </div>`;
    });
}
