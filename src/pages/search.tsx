import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search as SearchIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Comments from "../components/Comments";

interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

interface Video {
  id: number;
  image: string;
  video_files: VideoFile[];
  user: {
    id: number;
    name: string;
    url: string;
  };
  duration: number;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    async function searchVideos() {
      setIsLoading(true);
      setError("");

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/videos/search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setVideos(result.videos || []);
      } catch (error: any) {
        console.error('Error en búsqueda:', error);
        setError(`No se pudieron cargar los resultados: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    searchVideos();
  }, [query]);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedVideo]);

  const getBestVideoQuality = (videoFiles: VideoFile[]): string => {
    const hdVideo = videoFiles.find(file => file.quality === "hd");
    return hdVideo ? hdVideo.link : videoFiles[0]?.link || "";
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const toggleFavorite = (e: React.MouseEvent, videoId: number, video: Video) => {
    e.stopPropagation();
    
    let updatedFavorites: number[];
    let savedVideos = JSON.parse(localStorage.getItem("favoriteVideos") || "[]");
    
    if (favorites.includes(videoId)) {
      updatedFavorites = favorites.filter(id => id !== videoId);
      savedVideos = savedVideos.filter((v: Video) => v.id !== videoId);
    } else {
      updatedFavorites = [...favorites, videoId];
      savedVideos.push(video);
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    localStorage.setItem("favoriteVideos", JSON.stringify(savedVideos));
  };

  const isFavorite = (videoId: number) => favorites.includes(videoId);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 sm:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-gray-800 rounded-full transition"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <SearchIcon size={32} className="text-red-500" />
              Resultados de búsqueda
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Buscando: <span className="text-white font-semibold">"{query}"</span>
              {!isLoading && ` - ${videos.length} ${videos.length === 1 ? "resultado" : "resultados"}`}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Buscando videos...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-600 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon size={80} className="text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-gray-500 mb-6">
              Intenta con otros términos de búsqueda
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Volver al inicio
            </button>
          </div>
        )}

        {!isLoading && !error && videos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group relative bg-gray-900 hover:ring-2 hover:ring-red-500/50 transition-all"
              >
                <video
                  poster={video.image}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={getBestVideoQuality(video.video_files)}
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-white">
                  {video.duration}s
                </div>

                <button
                  onClick={(e) => toggleFavorite(e, video.id, video)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-all"
                  aria-label={isFavorite(video.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    size={18}
                    className={`transition-all ${
                      isFavorite(video.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={closeModal}
        >
          <div className="min-h-screen flex items-start justify-center p-4 py-8">
            <div
              className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative bg-black">
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  src={getBestVideoQuality(selectedVideo.video_files)}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-medium mb-1">
                      {selectedVideo.user.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {selectedVideo.duration} segundos
                    </p>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, selectedVideo.id, selectedVideo)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isFavorite(selectedVideo.id)
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isFavorite(selectedVideo.id) ? "fill-current" : ""}
                    />
                    <span className="text-sm font-medium">
                      {isFavorite(selectedVideo.id) ? "Guardado" : "Guardar"}
                    </span>
                  </button>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <Comments videoId={selectedVideo.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}