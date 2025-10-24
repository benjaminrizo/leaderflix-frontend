import { useEffect, useState } from "react";

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
};

export default function MovieSection({ title }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Mapeo de títulos a queries de búsqueda
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
        console.log('Fetching from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Videos received:', result);
        setVideos((result.videos || []).slice(0, 6));
      } catch (error: any) {
        console.error('Error completo:', error);
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
                {/* Video preview con poster */}
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
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-4xl">▶</div>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                  {video.duration}s
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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

            <div className="mt-4 text-white">
              <p className="text-lg">
                <span className="font-semibold">Creado por:</span> {selectedVideo.user.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Duración: {selectedVideo.duration} segundos
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}