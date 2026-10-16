// ===============================
// GOVGUIDE JAVASCRIPT
// ===============================


// Search Function
function searchWebsite() {

    const input = document.getElementById("searchInput");
    const searchText = input.value.trim();

    if (searchText === "") {
        alert("Please enter something to search.");
        return;
    }

    alert(
        "Searching GovGuide for: " +
        searchText +
        "\n\nSearch results feature will be connected in the next stage."
    );
}


// Popular Search
function quickSearch(text) {

    const input = document.getElementById("searchInput");

    input.value = text;

    input.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Explore GovGuide Button
function scrollToCategories() {

    const section = document.getElementById("education");

    section.scrollIntoView({
        behavior: "smooth"
    });
}


// Coming Soon Message
function comingSoon(sectionName) {

    alert(
        sectionName +
        "\n\nThis section is under development.\n\n" +
        "In the next stage, real government information, " +
        "job vacancies, exams, study material and schemes " +
        "will be added."
    );
}


// Login Button
function loginMessage() {

    alert(
        "GovGuide Login\n\n" +
        "Login and user dashboard will be added in the next stage."
    );
}


// Search Using Enter Key
const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            searchWebsite();
        }

    });

}


// Simple Welcome Message
console.log(
    "Welcome to GovGuide - Government Information Portal"
);