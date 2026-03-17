// Hero.tsx

export const Hero = () => {
  return (
    <section className="relative bg-[#f3f7fa] min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <img src="/logo.png" alt="logo DAND" className="w-48 md:w-64 mb:4 mx-auto" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            DAND
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            <strong className="text-primary">D</strong>esease <strong className="text-primary">A</strong>ssociated <strong className="text-primary">N</strong>europsychiatric <strong className="text-primary">D</strong>isorders
          </p>
          <div className="flex justify-center">
          </div>
        </div>
      </div>

      {/* gradiente di transizione verso il bianco*/}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#fff4fc] pointer-events-none" />
    </section>
  );
};
