import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

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

type Props = {
  title: string;
  favorites: number[]; // Recibe favoritos desde el padre
  onToggleFavorite: (videoId: number, video: Video) => Promise<void>; // Función del padre para manejar favoritos
};

export default function MovieSection({ title, favorites, onToggleFavorite }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<number | null>(null);

  const getSearchQuery = (sectionTitle: string): string => {
    const queryMap: { [key: string]: string } = {
      "Recomendadas para ti": "nature",
      "Más populares": "popular",
      "Nuevos lanzamientos": "technology",
      "Series destacadas": "ocean",
    };
    return queryMap[sectionTitle] || "nature";
  };

  useEffect(() => {
    async function fetchVideos() {
      const query = getSearchQuery(title);
      
      const endpoint = title === "Más populares" 
        ? "/videos/popular"
        : `/videos/search?query=${encodeURIComponent(query)}`;
      
      const url = `${import.meta.env.VITE_API_URL}/api${endpoint}`;
      
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        setVideos((result.videos || []).slice(0, 6));
      } catch (error: any) {
        setError(`Error al cargar los videos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideos();
  }, [title]);

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

  /**
   * Maneja el toggle de favoritos llamando a la función del padre
   * Muestra estado de carga mientras se procesa
   */
  const handleToggleFavorite = async (e: React.MouseEvent, videoId: number, video: Video) => {
    e.stopPropagation();
    
    // Evitar múltiples clicks mientras se procesa
    if (isTogglingFavorite === videoId) return;
    
    setIsTogglingFavorite(videoId);
    
    try {
      await onToggleFavorite(videoId, video);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsTogglingFavorite(null);
    }
  };

  const isFavorite = (videoId: number) => favorites.includes(videoId);

  const placeholders = new Array(6).fill(null);

  return (
    <>
      <section className="px-8 py-6">
        <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {isLoading ? (
            placeholders.map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))
          ) : (
            videos.map((video) => (
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

                {/* Favorite button con tooltip y estado de carga */}
                <button
                  onClick={(e) => handleToggleFavorite(e, video.id, video)}
                  disabled={isTogglingFavorite === video.id}
                  className={`absolute top-2 right-2 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all z-10 group ${
                    isTogglingFavorite === video.id ? 'cursor-wait opacity-70' : ''
                  }`}
                  aria-label={isFavorite(video.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isFavorite(video.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white hover:text-red-500"
                    } ${isTogglingFavorite === video.id ? 'animate-pulse' : ''}`}
                  />
                  {/* Tooltip */}
                  <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {isFavorite(video.id)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"}
                  </span>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

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
            {/* Botón cerrar con tooltip */}
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
              
              {/* Botón de favorito dentro del modal con tooltip */}
              <button
                onClick={(e) => handleToggleFavorite(e, selectedVideo.id, selectedVideo)}
                disabled={isTogglingFavorite === selectedVideo.id}
                className={`p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all relative group ${
                  isTogglingFavorite === selectedVideo.id ? 'cursor-wait opacity-70' : ''
                }`}
                aria-label={isFavorite(selectedVideo.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isFavorite(selectedVideo.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white hover:text-red-500"
                  } ${isTogglingFavorite === selectedVideo.id ? 'animate-pulse' : ''}`}
                />
                {/* Tooltip */}
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isFavorite(selectedVideo.id)
                    ? "Quitar de favoritos"
                    : "Agregar a favoritos"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}