Movie Search App

A responsive movie search web application built with HTML, CSS, and JavaScript. The app uses the OMDb API to search for movies and display useful details such as poster, release year, IMDb rating, genre, plot, director, actors, runtime, and box office information.

## Features

- Search movies by title
- Filter results by year
- Filter results by type: movie, series, or episode
- Display movie poster, title, year, and type
- View full movie details in a modal
- Show IMDb rating, runtime, genre, director, actors, plot, and box office
- Responsive design for desktop and mobile screens
- Loading, success, and error messages
- API key saved locally in the browser using `localStorage`

## Tech Stack

- HTML5
- CSS3
- JavaScript
- OMDb API

## Project Structure

```text
movie-search-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

### 1. Get an OMDb API Key

Create a free API key from the official OMDb website:

```text
https://www.omdbapi.com/apikey.aspx
```

After receiving the key, activate it from the email sent by OMDb.

### 2. Open the Project

Open the `index.html` file in any modern browser.

### 3. Add Your API Key

Paste your OMDb API key into the API key input field in the app and click `Save`.

The key is stored only in your browser's `localStorage`. It is not hardcoded in the source code.

### 4. Search Movies

Enter a movie name, choose optional filters, and click `Search`.

Example search:

```text
Batman
```

## API Usage

This project uses the OMDb API search endpoint:

```text
https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=batman
```

For movie details, it uses the IMDb ID endpoint:

```text
https://www.omdbapi.com/?apikey=YOUR_API_KEY&i=tt3896198&plot=full
```

## Important Note About API Keys

Do not hardcode your API key inside `script.js` before uploading the project to GitHub.

This project keeps the API key outside the source code by asking the user to enter it in the browser. This helps avoid exposing private API keys in public repositories.

## Screens

- Search page
- Movie result cards
- Movie details modal

## Future Improvements

- Add pagination for more search results
- Add favorite movies using `localStorage`
- Add dark mode
- Add search history
- Add rating-based sorting

## Author

Created as a frontend project using HTML, CSS, JavaScript, and the OMDb API.
