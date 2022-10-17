const API_KEY = 'api_key=2a90f92d8cd2ebc81c282097b3ba648b';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const EMBED_URL = 'https://2embed.org/embed';
// src="https://2embed.org/embed/movie?tmdb=${id}"
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

const embedMovie = (id) => `${EMBED_URL}/${id}`;
const embedEpisode = (id, season, episode) =>
  `${EMBED_URL}/${id}/${season}/${episode}`;

const imageApi = {
  originalImage: (imgPath) => `${IMG_URL}/original/${imgPath}`,
  w500Image: (imgPath) => `${IMG_URL}/w500/${imgPath}`,
  w200Image: (imgPath) => `${IMG_URL}/w200/${imgPath}`,
};
const category = {
  movie: 'movie',
  tv: 'tv',
};
const movieType = {
  trending: 'trending',
  upcoming: 'upcoming',
  popular: 'popular',
  top_rated: 'top_rated',
};
const tvType = {
  trending: 'trending',
  popular: 'popular',
  top_rated: 'top_rated',
  on_the_air: 'on_the_air',
};

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';   
var totalPages = 100;

var selectedGenre = []
setGenre();
function setGenre(){
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id)
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+ encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){
        selectedGenre.forEach(id => {
            const highlightedTag =document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'CLEAR TAGS/SEARCH';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }

}


getMovies(API_URL);

function getMovies(url) {
  lastUrl = url
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;   
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            }else if(currentPage >= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})
        }else{
            main.innerHTML= `<h1>No Results Available</h1>`
        }
    })
}

/*location.replace(WATCH_MOVIE + id)*/

function showMovies(data){
    main.innerHTML = ``;

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');     
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "https://via.placeholder.com/1080x1580"}" alt="${title}">
                
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>${title}</h3>
               ${overview}
               <br/>
               <!--<button class="know-more" id="${id}">Trailer</button>-->
               <button class="watch" id="${id}">Watch Movie</button>
            </div>
        
        `
        main.appendChild(movieEl)

        

        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
        
    });
}

/* Open when someone clicks on the span element */
const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed = [];
        var dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
            <iframe width="1080" height="550" src="https://2embed.org//embed/movie?tmdb=${id}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

            dots.push(`
              <span class="dot">${idx + 1}</span>
            `)
          }
        })
        
        var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>
        <div class="dots">${dots.join('')}</div>
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    }
  })
}
  
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
/* My New Code 
function Video({ src }) {
  return (
    <div
      className="relative w-full duration-200 rounded-md overflow-hidden"
      style={{ paddingBottom: '55%' }}
    >
      <iframe
        title={src}
        className="absolute top-0 left-0 w-full h-full z-10"
        src={src}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
function Overview({ title, overview }) {
  const { category } = useParams();

  const handleRenderStar = (n) => {
    let i = 0;
    let stars = [];
    let surplus = n % 1;
    n = Math.floor(n / 1);
    while (i < n) {
      stars.push(<StarSolid />);
      i++;
    }
    if (surplus) {
      stars.push(<StarHalf />);
    }
    n = 10 - n;
    i = surplus ? 1 : 0;
    while (i < n) {
      i++;
      stars.push(<Star />);
    }
    return stars;
  };

  const path =
    category === 'movie' ? `/catalog/movie/${overview.id}` : `/catalog/tv/${overview.id}`;
  // const pathPlay = category === 'movie' ? `/movie/${overview.id}/play` : `/tv/${overview.id}/play`;

  return (
    <div className="text-gray-300 relative z-10 space-y-3 pt-3">
      <h1>
        <Link to={path} className="text-2xl hover:text-red-600 duration-150">
          {title}
        </Link>
      </h1>
      {category === 'tv' && (
        <h2 className="text-lg">Episode name:&nbsp;{overview.name || overview.title}</h2>
      )}
      <p>{overview.overview}</p>
      <div>
        Release Date:&nbsp;
        {overview.first_air_date || overview.release_date || overview.air_date}
      </div>
      <div className="flex py-2 flex-wrap">
        {overview.genres?.length > 0 &&
          overview.genres.map((item, i) => (
            <span
              key={i}
              className="px-3 py-2 rounded-3xl border-2 border-gray-300 cursor-pointer hover:text-gray-400 hover:border-gray-400 duration-300 whitespace-nowrap mb-3 mr-3"
            >
              {item.name}
            </span>
          ))}
      </div>
      <div className="flex">
        {handleRenderStar(overview.vote_average)}
        <span className="ml-2">({overview.vote_count}&nbsp;votes)</span>
      </div>
    </div>
  );
};

function Preloader() {
  return (
    <div
      className="preloader-layout fixed inset-0 z-50 bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="preloader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

const tmdbApi = {
  getTrendingList: (category, params) => {
    const url = `trending/${category}/day`;
    return axios.get(url, params);
  },
  getMoviesList: (type, params) => {
    const url = `movie/${movieType[type]}`;
    return axios.get(url, params);
  },
  getTvList: (type, params) => {
    const url = `tv/${tvType[type]}`;
    return axios.get(url, params);
  },
  getVideos: (cate, id) => {
    const url = `${category[cate]}/${id}/videos`;
    return axios.get(url, { params: {} });
  },
  search: (cate, params) => {
    const url = `search/${category[cate]}`;
    return axios.get(url, params);
  },
  detail: (cate, id, params) => {
    const url = `${category[cate]}/${id}`;
    return axios.get(url, params);
  },
  credits: (cate, id) => {
    const url = `${category[cate]}/${id}/credits`;
    return axios.get(url, { params: {} });
  },
  similar: (cate, id) => {
    const url = `${category[cate]}/${id}/similar`;
    return axios.get(url, { params: {} });
  },
  getTVSeasons: (id, seasonNumber) => {
    const url = `tv/${id}/season/${seasonNumber}`;
    return axios.get(url, { params: {} });
  },
};

function Season({ season, handleUrl, id, background }) {
  const episodeRef = useRef(null);
  const navigate = useNavigate();
  const { category } = useParams();
  const [episodes, setEpisodes] = useState([]);

  const handleSeason = () => {
    if (category === 'movie') {
      navigate(`/movie/${season.id}/play`);
    } else {
      episodeRef.current.classList.toggle('h-0');
    }
  };

  const bgMovie = season.backdrop_path ? season.backdrop_path : season.poster_path;

  useEffect(() => {
    const fetchEpisode = async () => {
      if (category !== 'tv') return;
      try {
        const response = await tmdbApi.getTVSeasons(id, season.season_number);
        setEpisodes(response.episodes);
      } catch (error) {}
    };

    fetchEpisode();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, season]);

  return (
    <div>
      <div
        onClick={handleSeason}
        className="relative flex text-gray-300 bg-penetration-7 group cursor-pointer group"
      >
        <div className="overflow-hidden w-1/3">
          <img
            src={imageApi.w200Image(bgMovie ? bgMovie : background)}
            alt=""
            className="w-full transform duration-200 h-16 mt-812:h-20 object-cover group-hover:scale-110"
          />
        </div>

        <div className="w-2/3">
          <h2 className="flex items-center duration-200 group-hover:text-red-600 px-3 h-full">
            {season.name || season.title}
          </h2>
        </div>

        <div className="absolute top-1/2 transform -translate-y-1/2 right-3 flex items-center">
          <svg
            width="20"
            height="20"
            className="ml-0 transform duration-200 -translate-x-3 group-hover:translate-x-0"
            viewBox="0 0 24 24"
            style={{ fill: '#D1D5DB' }}
          >
            <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path>
          </svg>
        </div>
      </div>
      <div ref={episodeRef} className="h-0 overflow-hidden duration-300">
        {episodes &&
          episodes.map((episode) => (
            <Episode
              key={episode.id}
              episode={episode}
              background={background}
              seasonNumber={season.season_number}
              handleUrl={handleUrl}
            />
          ))}
      </div>
    </div>
  );
}

function PlayMovie() {
  const { category, id } = useParams();
  const otherRef = useRef(null);
  const [src, setSrc] = useState('');
  const [title, setTitle] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [overview, setOverview] = useState({});
  const [preloader, setPreloader] = useState(true);
  const [background, setBackground] = useState('');
  const [, setSearchParams] = useSearchParams();

  const fetchMovie = async () => {
    try {
      const params = {};
      const response = await tmdbApi.detail(category, id, { params });
      if (category === 'tv') {
        setSeasons(response.seasons);
        setOverview(response);
      } else {
        setOverview(response);
        const { results } = await tmdbApi.getTrendingList(category, {
          params,
        });
        setSeasons(results);
      }
      const backgroundTemp = response.backdrop_path
        ? response.backdrop_path
        : response.poster_path;
      setBackground(backgroundTemp);

      const titleTemp = response.title ? response.title : response.name;
      setTitle(titleTemp);
      setPreloader(false);
    } catch (error) {}
  };

  const handleUrl = (season = 1, episode = overview) => {
    if (category === 'movie') return setSrc(embedMovie(id));

    setOverview(episode);
    setSrc(embedEpisode(id, season, episode.episode_number ? episode.episode_number : 1));
    setSearchParams({ season, episode: episode.episode_number || 1 });

    handleScrollToTop();
  };

  const handleBackground = (movie) => {
    return movie.backdrop_path ? movie.backdrop_path : movie.poster_path;
  };

  useEffect(() => {
    fetchMovie();
    handleUrl();
    handleScrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (preloader) return <Preloader />;

  return (
    <Page title={title}>
      <div
        className="bg__play w-full bg-cover bg-no-repeat bg-center pt-16 mt-812:pb-10"
        style={{
          backgroundImage: `url(${imageApi.originalImage(background)})`,
        }}
      >
        <div className="w-full mt-812:px-0 px-3 mt-812:w-11/12 mx-auto">
          <div className="flex mt-812:flex-row flex-col mt-812:space-x-5">
            <div className="w-full mt-812:w-2/3 mb-5 mt-812:mb-0">
              <Video src={src} />
              <Overview title={title} overview={overview} />
            </div>
            <div className="w-full mt-812:w-1/3 z-10" ref={otherRef}>
              <div className="text-gray-300 text-2xl mb-2">
                {category === 'tv' ? 'Other Episodes' : 'Trending Movies'}
              </div>
              <div className="h-700 overflow-y-auto overflow-hidden rounded-md scroll__custom space-y-2">
                {seasons &&
                  seasons.map((season) => {
                    return (
                      <Season
                        key={season.id}
                        season={season}
                        background={background || handleBackground(season)}
                        handleUrl={handleUrl}
                        category={category}
                        id={id}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="relative z-10 -mx-3">
            <MovieList category={category} type="similar" title="Similar" id={id} />
          </div>
        </div>
      </div>
    </Page>
  );
}


New Code End*/
var activeSlide = 0;
var totalVideos = 0;


var activeSlide = 0;
function showVideos(){
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');
  
    totalVideos = embedClasses.length; 
    embedClasses.forEach((embedTag, idx) => {
      if(activeSlide == idx){
        embedTag.classList.add('show')
        embedTag.classList.remove('hide')
  
      }else{
        embedTag.classList.add('hide');
        embedTag.classList.remove('show')
      }
    })
    dots.forEach((dot, indx) => {
        if(activeSlide == indx){
          dot.classList.add('active');
        }else{
          dot.classList.remove('active')
        }
      })
}
    
const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')
    
leftArrow.addEventListener('click', () => {
      if(activeSlide > 0){
        activeSlide--;
      }else{
        activeSlide = totalVideos -1;
      }
    
      showVideos()
    })
    
rightArrow.addEventListener('click', () => {
      if(activeSlide < (totalVideos -1)){
        activeSlide++;
      }else{
        activeSlide = 0;
      }
      showVideos()
    })

function getColor(vote){
    if(vote>= 8){
        return 'green'
    }else if(vote>= 5){
        return 'orange'
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    highlightSelection()

    if(searchTerm) {
        getMovies(searchURL+'&query=/'+searchTerm)
    }else{
        getMovies(API_URL);
    }
})

prev.addEventListener('click', () => {
    if(prevPage <= totalPages){
        pageCall(prevPage);
    }
})

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page='+page
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b
        getMovies(url);
    }
}
