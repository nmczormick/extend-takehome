import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

function MovieDetails({movie, trailers}) {
  return (
    <div style={{margin: '50px'}}>
      <p>{movie.title}</p>
      <p>{movie.overview}</p>
      {trailers.map((trailer) => (
        <iframe
          width="320"
          title={movie.title}
          height="240"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          referrerPolicy="no-referrer-when-downgrade"
        >
        </iframe>
      ))}
    </div>
  )
}

function MoviesByYear({movies = [], fetchMovieDetails, fetchVideos}) {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
      {movies.map((movie) => (
        <div style={{ width: "500px", border: "1px solid black", margin: "15px" }}>
          <img style={{width: "500px"}} src={'http://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title + " poster"} />
          <p>{ movie.title }</p>
          <p>Popularity Score: { movie.popularity}</p>
          <button onClick={async () => {
            await fetchMovieDetails(movie.id);
            await fetchVideos(movie.id);
          }}>
            <NavLink style={{ textDecoration: "none", color: "black"}} to={"/movie/" + movie.title}>
              Learn More About {movie.title}
            </NavLink> 
          </button>
        </div>
      ))}
    </div>
  )
}

function Home({
  selectedOption,
  sortByOptions,
  setSelectedOption,
  fetchTopTenPopularMovies,
  options,
  sortByOption,
  setSortByOption,
  setOptions,
}) {
  return (
    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
      <select
          value = {selectedOption}
          onChange = {async (e) => {
            setSelectedOption(e.target.value)
            await fetchTopTenPopularMovies(e.target.value);
        }}
      >
        <option key="default" value="">Please Select a Year</option>
        {options.map((option) => (
              <option 
                  key={option.value}
                  value={option.value}
              >
                    {option.label}
              </option>
        ))}
      </select>
      <select
          value = {sortByOption}
          onChange={(e) => {
              setSortByOption(e.target.value)
              setOptions(options.reverse())
          }}
      >
        {sortByOptions.map((option) => (
          <option
              key={option.value}
              value={option.value}
          >
            {option.label}
          </option>
          ))}
      </select>
      {selectedOption &&
        <button>
          <NavLink style={{ textDecoration: "none", color: "black"}} to={"/year/" + selectedOption}>
            See {selectedOption}'s Most Popular Movies
          </NavLink>
        </button>
      }
    </div>
  )
}
 
function App() {
  const [top10Movies, setTop10Movies] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [sortByOption, setSortByOption] = useState("Descending");
  const [movieDetails, setMovieDetails] = useState([]);
  const [movieTrailers, setMovieTrailers] = useState([]);
  const [options, setOptions] = useState([
      {value: "2024", label: "2024"},
      {value: "2023", label: "2023"},
      {value: "2022", label: "2022"},
      {value: "2021", label: "2021"},
      {value: "2020", label: "2020"},
  ]);

  const sortByOptions = [
      {value: "Ascending", label: "Ascending"},
      {value: "Descending", label: "Descending"},
  ];

  useEffect(() => {
  }, [selectedOption, sortByOption, movieTrailers, movieDetails, top10Movies])

  const fetchTopTenPopularMovies = (movieYear) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${movieYear}`, {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNmQ5MzJiMWU3NWNkYTZhMTUxZDJkZWI1ODQyMWU1NyIsIm5iZiI6MTcyNjc3NzI4My41ODcwOTYsInN1YiI6IjY2ZWM4NWY5M2QyOWUxMzg5NjQ2Y2RmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2rgl12eaTha2dGiM9E1Nm3h1pZMLzPokPpC4K31IG1U',
      }
    })
      .then(res => res.json())
      .then(json => setTop10Movies(json.results.slice(10)))
      .catch(err => console.error('error: ' + err));
  }

  const fetchMovieDetails = (movieID) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}`, {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNmQ5MzJiMWU3NWNkYTZhMTUxZDJkZWI1ODQyMWU1NyIsIm5iZiI6MTcyNjc3NzI4My41ODcwOTYsInN1YiI6IjY2ZWM4NWY5M2QyOWUxMzg5NjQ2Y2RmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2rgl12eaTha2dGiM9E1Nm3h1pZMLzPokPpC4K31IG1U',
      }
    })
      .then(res => res.json())
      .then(json => setMovieDetails(json))
      .catch(err => console.error('error: ' + err));
  }

  const fetchVideos = (movieID) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos`, {
      method: 'GET',
      headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNmQ5MzJiMWU3NWNkYTZhMTUxZDJkZWI1ODQyMWU1NyIsIm5iZiI6MTcyNjc3NzI4My41ODcwOTYsInN1YiI6IjY2ZWM4NWY5M2QyOWUxMzg5NjQ2Y2RmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2rgl12eaTha2dGiM9E1Nm3h1pZMLzPokPpC4K31IG1U',
        }
      })
        .then(res => res.json())
        .then(json => setMovieTrailers(json.results))
        .catch(err => console.error('error: ' + err))
  }

  return (
      <Routes>
        <Route
          path="/"
          element={<Home
            selectedOption = { selectedOption }
            sortByOptions={ sortByOptions }
            setSelectedOption={ setSelectedOption }
            fetchTopTenPopularMovies={ fetchTopTenPopularMovies }
            options={ options }
            sortByOption={ sortByOption }
            setSortByOption={ setSortByOption }
            setOptions={ setOptions } />}
          >
        </Route>
        <Route
          path="/year/:year"
          element={
            <MoviesByYear movies={top10Movies} fetchMovieDetails={fetchMovieDetails} fetchVideos={fetchVideos}/>
        }>
        </Route>
        <Route
          path="/movie/:movie_title"
          element={<MovieDetails movie={ movieDetails } trailers={ movieTrailers }/>
        }>
        </Route>
      </Routes>
  );
}

export default App;
