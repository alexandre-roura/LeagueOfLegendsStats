export default function Header() {
  return (
    <header className="relative text-center mb-12 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lol-gold/5 to-transparent"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-lol-gold/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main title */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-cinzel font-bold bg-gradient-to-r from-lol-gold via-yellow-300 to-lol-gold bg-clip-text text-transparent animate-glow drop-shadow-2xl">
            LEAGUE OF LEGENDS
          </h1>
          <div className="mt-2 text-2xl md:text-3xl font-cinzel font-semibold text-lol-gold/80 tracking-widest">
            STATS TRACKER
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 font-inter max-w-2xl mx-auto leading-relaxed">
          Discover detailed summoner statistics, rankings, and performance
          insights
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-lol-gold"></div>
          <div className="w-3 h-3 bg-lol-gold rounded-full animate-pulse"></div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-lol-gold"></div>
        </div>
      </div>
    </header>
  );
}
