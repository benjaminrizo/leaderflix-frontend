import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search as SearchIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Buscar videos cuando cambia la query
  useEffect(() => {
    if (!query) return;

    async function searchVideos() {
      setIsLoading(true);
      setError("");

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/videos/search?query=${encodeURIComponent(query)}`;
        console.log('Buscando:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Resultados:', result);
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

  // Funciones para manejar favoritos
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
      
      <main className="flex-1 px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-gray-800 rounded-full transition"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <SearchIcon size={32} className="text-red-500" />
              Resultados de búsqueda
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Buscando: <span className="text-white font-semibold">"{query}"</span>
              {!isLoading && ` - ${videos.length} ${videos.length === 1 ? "resultado" : "resultados"}`}
            </p>
          </div>
        </div>

        {/* Estados de carga y error */}
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

        {/* Sin resultados */}
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

        {/* Resultados */}
        {!isLoading && !error && videos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group relative bg-gray-900"
              >
                {/* Video preview */}
                <video
                  poster={video.image}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  src={getBestVideoQuality(video.video_files)}
                  onMouseEnter={(e) => {
                    e.currentTarget.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                  {video.duration}s
                </div>

                {/* Favorite button */}
                <button
                  onClick={(e) => toggleFavorite(e, video.id, video)}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all z-10"
                  aria-label={isFavorite(video.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isFavorite(video.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white hover:text-red-500"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Modal para reproducir video */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-8"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <video
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-lg shadow-2xl object-contain bg-black"
              src={getBestVideoQuality(selectedVideo.video_files)}
            >
              Tu navegador no soporta la reproducción de video.
            </video>

            <div className="mt-4 text-white flex justify-between items-center">
              <div>
                <p className="text-lg">
                  <span className="font-semibold">Creado por:</span> {selectedVideo.user.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Duración: {selectedVideo.duration} segundos
                </p>
              </div>
              
              {/* Botón de favorito en el modal */}
              <button
                onClick={(e) => toggleFavorite(e, selectedVideo.id, selectedVideo)}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
                aria-label={isFavorite(selectedVideo.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isFavorite(selectedVideo.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}