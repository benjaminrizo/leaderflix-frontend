type Props = {
    title: string;
    movies?: string[]; // en el futuro serán URLs de carátulas
  };
  
  export default function MovieSection({ title }: Props) {
    // simularemos 6 espacios vacíos por ahora
    const placeholders = new Array(6).fill(null);
  
    return (
      <section className="px-8 py-6">
        <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {placeholders.map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-700 transition cursor-pointer"
            >
              Carátula
            </div>
          ))}
        </div>
      </section>
    );
  }
  