# IMD3.js

## Intro

A movie analytics storyboard made for Harvard University's Fall 2022 CS 171 final project, by:

Tom Zhang, Wilson Lama, and Teddy Lin.

## How to Run the App

Our app is hosted with GitHub Pages. Navigate to [wilson-lama.github.io/IMD3.js](https://wilson-lama.github.io/IMD3.js)

## Libraries Used

- [D3.js](https://d3js.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Scroll Magic](https://scrollmagic.io/)

## Data Description

We got most of our data from IMDb's [public datasets](https://www.imdb.com/interfaces/).

The datasets that we used in our project include the following:

**title.basics.tsv** - Contains the following information for titles: 
- tconst (string, categorical) - alphanumeric unique identifier of the title
- titleType (string, categorical) – the type/format of the title (e.g. movie, short, tvseries, tvepisode, video, etc)
- primaryTitle (string, categorical) – the more popular title / the title used by the filmmakers on promotional materials at the point of release
- originalTitle (string, categorical) - original title, in the original language
- isAdult (boolean, categorical) - 0: non-adult title; 1: adult title
- startYear (YYYY, quantitative) – represents the release year of a title. In the case of TV Series, it is the series start year 
- endYear (YYYY, quantitative) – TV Series end year. ‘\N’ for all other title types
- runtimeMinutes (quantitative) – primary runtime of the title, in minutes
- genres (string array, quantitative) – includes up to three genres associated with the title

**title.principals.tsv** – Contains the principal cast/crew for titles
- tconst (string, categorical) - alphanumeric unique identifier of the title
- ordering (integer, categorical) – a number to uniquely identify rows for a given titleId
- nconst (string, categorical) - alphanumeric unique identifier of the name/person
- category (string, categorical) - the category of job that person was in
- job (string, categorical) - the specific job title if applicable, else '\N'
- characters (string, categorical) - the name of the character played if applicable, else '\N'

**title.ratings.tsv** – Contains the IMDb rating and votes information for titles 
- tconst (string, categorical) - alphanumeric unique identifier of the title
- averageRating (quantitative) – weighted average of all the individual user ratings
- numVotes (quantitative) - number of votes the title has received
                                                                     
**popular.movies.tsv** - Contains the top 200 movies by revenue
- rank (quantitative) - rank of movie by total revenue
- movie (string, categorical) - title of the movie
- revenue (quantitative) - total revenue grossed by this movie
- year (YYYY, quantitative) - release year of the movie
- leo (binary, quantitative) - 1 if Leonardo DiCaprio starred in this movie, 0 if he did not