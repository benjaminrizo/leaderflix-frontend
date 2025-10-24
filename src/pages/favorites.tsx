import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
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

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem("favoriteVideos");
    if (savedVideos) {
      setFavorites(JSON.parse(savedVideos));
    }
  }, []);

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

  // Eliminar de favoritos
  const removeFavorite = (videoId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const updatedFavorites = favorites.filter(v => v.id !== videoId);
    setFavorites(updatedFavorites);
    
    // Actualizar localStorage
    localStorage.setItem("favoriteVideos", JSON.stringify(updatedFavorites));
    
    const savedFavoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedIds = savedFavoriteIds.filter((id: number) => id !== videoId);
    localStorage.setItem("favorites", JSON.stringify(updatedIds));
  };

  // Limpiar todos los favoritos
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" size={32} />
                Mis Favoritas
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {favorites.length} {favorites.length === 1 ? "película" : "películas"} guardada{favorites.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <Trash2 size={18} />
              Limpiar todo
            </button>
          )}
        </div>

        {/* Lista de favoritos */}
        {favorites.length === 0 ? (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((video) => (
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
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-4xl">▶</div>
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                  {video.duration}s
                </div>

                {/* Remove button */}
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
              
              {/* Botón para eliminar */}
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