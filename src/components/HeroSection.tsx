import { motion } from "framer-motion";
import { ChevronDown, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-field.jpg";

const HeroSection = () => {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Lapangan Putroagung" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-24 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6 border border-secondary/30">
              ⚽ Voli • Basket • Mini Soccer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading tracking-wider text-secondary mb-4"
          >
            LAPANGAN
            <br />
            <span className="text-gradient-gold">PUTROAGUNG</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto"
          >
            Tempat olahraga terbaik dengan fasilitas modern. Booking mudah, harga terjangkau.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button variant="hero" size="lg" className="text-base" asChild>
              <a href="/booking">
                <MapPin className="w-5 h-5" />
                Booking Sekarang
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base" onClick={() => document.getElementById('lapangan')?.scrollIntoView({ behavior: 'smooth' })}>
              Lihat Lapangan
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {[
              { icon: MapPin, label: "3 Lapangan", sub: "Voli, Basket, Soccer" },
              { icon: Clock, label: "07:00 - 20:00", sub: "Setiap Hari" },
              { icon: Star, label: "Terpercaya", sub: "Fasilitas Lengkap" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">{stat.label}</p>
                  <p className="text-xs text-primary-foreground/60">{stat.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-secondary/60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
