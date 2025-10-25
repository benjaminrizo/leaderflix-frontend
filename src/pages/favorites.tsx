import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Interface for video file metadata
interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
}

// Main video object interface
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedVideos = localStorage.getItem("favoriteVideos");
    if (savedVideos) {
      setFavorites(JSON.parse(savedVideos));
    }
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

  // Remove a single video from favorites
  const removeFavorite = (videoId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent modal from opening when clicking delete
    
    // Filter out the removed video
    const updatedFavorites = favorites.filter(v => v.id !== videoId);
    setFavorites(updatedFavorites);
    
    // Update localStorage with new favorites list
    localStorage.setItem("favoriteVideos", JSON.stringify(updatedFavorites));
    
    // Also update the favorites IDs array
    const savedFavoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedIds = savedFavoriteIds.filter((id: number) => id !== videoId);
    localStorage.setItem("favorites", JSON.stringify(updatedIds));
  };

  // Clear all favorites with confirmation
  const clearAllFavorites = () => {
    if (confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
      setFavorites([]);
      localStorage.removeItem("favoriteVideos");
      localStorage.removeItem("favorites");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-8 py-8">
        {/* Header Section - Improved layout for mobile */}
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
          
          {/* Counter and clear button row - aligned with content */}
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
                {/* Responsive text: "Limpiar" on mobile, "Limpiar todo" on desktop */}
                <span className="hidden sm:inline">Limpiar todo</span>
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Favorites List or Empty State */}
        {favorites.length === 0 ? (
          // Empty state - shown when no favorites exist
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
        ) : (
          // Grid of favorite videos - responsive columns
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
                    e.currentTarget.play().catch(() => {}); // Play on hover (desktop)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0; // Reset to beginning
                  }}
                />

                {/* Duration badge - bottom right corner */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                  {video.duration}s
                </div>

                {/* Remove button - top right corner */}
                <button
                  onClick={(e) => removeFavorite(video.id, e)}
                  className="absolute top-2 right-2 p-2 bg-red-600 bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all z-10"
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

      {/* Video Player Modal - fullscreen overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-8"
          onClick={closeModal} // Close when clicking backdrop
        >
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking video
          >
            {/* Close button - top right */}
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10"
              aria-label="Cerrar"
            >
              ✕
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
                  removeFavorite(selectedVideo.id);
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