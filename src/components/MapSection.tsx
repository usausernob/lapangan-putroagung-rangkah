import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const MapSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Lokasi</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-wider text-foreground mt-2">
            TEMUKAN KAMI
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-accent" /> Putroagung, Surabaya, Jawa Timur
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border shadow-lg"
        >
          <iframe
            src="https://maps.google.com/maps?q=Lapangan+Putro+Agung+Rangkah+Tambaksari+Surabaya&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Lapangan Putro Agung"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
