// Define the component props type
type Props = {
  title: string; // Section title
  movies?: string[]; // Optional array - will contain cover image URLs in the future
};

export default function MovieSection({ title }: Props) {
  // Create an array of 6 null values to simulate empty movie slots
  const placeholders = new Array(6).fill(null);
  
  return (
    <section className="px-8 py-6">
      {/* Section title */}
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      
      {/* Grid layout that adapts to different screen sizes:
          - 2 columns on mobile
          - 3 columns on small screens
          - 6 columns on medium+ screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {placeholders.map((_, i) => (
          <div
            key={i}
            // Movie cover placeholder with 2:3 aspect ratio (standard poster dimensions)
            className="aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-700 transition cursor-pointer"
          >
            Carátula {/* Placeholder text meaning "Cover" */}
          </div>
        ))}
      </div>
    </section>
  );
}