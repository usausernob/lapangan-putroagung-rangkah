import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import sportVoli from "@/assets/sport-voli.jpg";
import sportBasket from "@/assets/sport-basket.jpg";
import sportSoccer from "@/assets/sport-soccer.jpg";

const sports = [
  {
    name: "Mini Soccer",
    id: "soccer",
    image: sportSoccer,
    description: "Lapangan mini soccer dengan rumput sintetis premium dan gawang standar.",
    capacity: "14 Pemain",
  },
  {
    name: "Voli",
    id: "voli",
    image: sportVoli,
    description: "Lapangan voli standar dengan net profesional dan lantai berkualitas tinggi.",
    capacity: "12 Pemain",
  },
  {
    name: "Basket",
    id: "basket",
    image: sportBasket,
    description: "Lapangan basket full court dengan ring standar dan pencahayaan optimal.",
    capacity: "10 Pemain",
  },
];

const SportCards = () => {
  return (
    <section id="lapangan" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Fasilitas</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-wider text-foreground mt-2">
            PILIH LAPANGAN
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Tiga pilihan lapangan dengan standar kualitas terbaik untuk pengalaman olahraga Anda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link
                to={`/galeri/${sport.id}`}
                className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-accent/50 shadow-sm hover:shadow-xl transition-all duration-500 block"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 text-secondary text-xs font-bold">
                    {sport.capacity}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Camera className="w-4 h-4" /> Lihat Galeri
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-heading tracking-wider text-foreground">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{sport.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCards;
