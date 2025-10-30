import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFavorites, removeFavorite } from "../services/api";

// Interface for video file metadata
interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

// Interface for favorite from API
interface FavoriteFromAPI {
  video_id: number;
  image: string;
  duration: number;
  video_url: string;
  user_name: string;
}

// Main video object interface (adapted for display)
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

  /**
   * Load favorites from API on component mount
   * Transforms API data to match Video interface
   */
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
        
        // Transform API data to Video format
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

  // Get the best quality video file available (prioritize HD)
  const getBestVideoQuality = (videoFiles: VideoFile[]): string => {
    const hdVideo = videoFiles.find(file => file.quality === "hd");
    return hdVideo ? hdVideo.link : videoFiles[0]?.link || "";
  };

  // Handle video card click to open modal
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  // Close video player modal
  const closeModal = () => {
    setSelectedVideo(null);
  };

  /**
   * Remove a single video from favorites
   * Calls API and updates local state
   */
  const handleRemoveFavorite = async (videoId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent modal from opening when clicking delete
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debes iniciar sesión");
        return;
      }

      // Call API to remove favorite
      await removeFavorite(userId, videoId);
      
      // Update local state to reflect the change
      setFavorites(prev => prev.filter(v => v.id !== videoId));
      
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      alert(error.message || "Error al eliminar favorito");
    }
  };

  /**
   * Clear all favorites with confirmation
   * Removes each favorite through API calls
   */
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

      // Remove all favorites sequentially
      const deletePromises = favorites.map(video => 
        removeFavorite(userId, video.id)
      );
      
      await Promise.all(deletePromises);
      
      // Clear local state
      setFavorites([]);
      
    } catch (error: any) {
      console.error("Error al limpiar favoritos:", error);
      alert(error.message || "Error al limpiar favoritos");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Title row with back button and title */}
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
          
          {/* Counter and clear button row */}
          <div className="flex items-center justify-between pl-14 sm:pl-16">
            <p className="text-gray-400 text-sm">
              {favorites.length} {favorites.length === 1 ? "película" : "películas"} guardada{favorites.length !== 1 ? "s" : ""}
            </p>
            
            {/* Clear all button - only visible when there are favorites */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-400">Cargando favoritos...</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Empty State */}
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

        {/* Favorites Grid */}
        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group relative bg-gray-900"
              >
                {/* Video preview with hover effect */}
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

                {/* Remove button with tooltip */}
                <button
                  onClick={(e) => handleRemoveFavorite(video.id, e)}
                  className="absolute top-2 right-2 p-2 bg-red-600 bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all z-10 group"
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 size={16} className="text-white" />
                  {/* Tooltip */}
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Eliminar
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Video Player Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-8"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with tooltip */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10 group"
              aria-label="Cerrar"
            >
              ✕
              <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Cerrar video
              </span>
            </button>

            {/* Video player */}
            <video
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-lg shadow-2xl object-contain bg-black"
              src={getBestVideoQuality(selectedVideo.video_files)}
            >
              Tu navegador no soporta la reproducción de video.
            </video>

            {/* Video info and actions */}
            <div className="mt-4 text-white flex justify-between items-center">
              <div>
                <p className="text-lg">
                  <span className="font-semibold">Creado por:</span> {selectedVideo.user.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Duración: {selectedVideo.duration} segundos
                </p>
              </div>
              
              {/* Delete button in modal */}
              <button
                onClick={() => {
                  handleRemoveFavorite(selectedVideo.id);
                  closeModal();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}