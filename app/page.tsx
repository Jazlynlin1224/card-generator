import CardCustomizer from './components/CardCustomizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-teal-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-serif text-center mb-3 text-gray-800 font-playfair tracking-wide">
          回忆即刻
        </h1>
        <p className="text-center mb-12 text-gray-600 font-light text-lg font-lato tracking-wider">
          创建你的专属拍立得照片，定格美好瞬间
        </p>
        <div className="max-w-6xl mx-auto backdrop-blur-sm bg-white/30 rounded-2xl p-8 shadow-lg">
          <CardCustomizer />
        </div>
      </div>
    </main>
  );
}
