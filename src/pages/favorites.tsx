import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import { getFavorites, removeFavorite } from "../services/api";

interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

interface FavoriteFromAPI {
  video_id: number;
  image: string;
  duration: number;
  video_url: string;
  user_name: string;
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

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Debes iniciar sesión para ver tus favoritos");
          setIsLoading(false);
          return;
        }

        const favoritesData: FavoriteFromAPI[] = await getFavorites(userId);
        
        const transformedVideos: Video[] = favoritesData.map(fav => ({
          id: fav.video_id,
          image: fav.image,
          duration: fav.duration,
          video_files: [
            {
              id: fav.video_id,
              quality: "hd",
              file_type: "video/mp4",
              link: fav.video_url,
            }
          ],
          user: {
            id: 0,
            name: fav.user_name,
            url: "",
          }
        }));

        setFavorites(transformedVideos);
      } catch (error: any) {
        console.error("Error al cargar favoritos:", error);
        setError(error.message || "Error al cargar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

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

  const handleRemoveFavorite = async (videoId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión");
        return;
      }

      await removeFavorite(userId, videoId);
      setFavorites(prev => prev.filter(v => v.id !== videoId));
      
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      alert(error.message || "Error al eliminar favorito");
    }
  };

  const clearAllFavorites = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión");
        return;
      }

      const deletePromises = favorites.map(video => 
        removeFavorite(userId, video.id)
      );
      
      await Promise.all(deletePromises);
      setFavorites([]);
      
    } catch (error: any) {
      console.error("Error al limpiar favoritos:", error);
      alert(error.message || "Error al limpiar favoritos");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 sm:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Heart className="text-red-500 fill-red-500" size={28} />
              Mis Favoritas
            </h1>
          </div>
          
          <div className="flex items-center justify-between pl-14 sm:pl-16">
            <p className="text-gray-400 text-sm">
              {favorites.length} {favorites.length === 1 ? "película" : "películas"} guardada{favorites.length !== 1 ? "s" : ""}
            </p>
            
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Limpiar todo</span>
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-400">Cargando favoritos...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-500 mb-4 text-5xl">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              Error al cargar favoritos
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={80} className="text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-500 mb-6">
              Comienza a agregar películas que te gusten
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Explorar películas
            </button>
          </div>
        )}

        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {favorites.map((video) => (
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
                  onClick={(e) => handleRemoveFavorite(video.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 rounded-full transition-all z-10"
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 size={16} className="text-white" />
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
                    onClick={() => {
                      handleRemoveFavorite(selectedVideo.id);
                      closeModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm font-medium">Eliminar</span>
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