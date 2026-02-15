import { motion } from "framer-motion";
import { Shield, Droplets, Sparkles, Receipt } from "lucide-react";

const priceItems = [
  { icon: Receipt, label: "Sewa Lapangan", price: "Rp 100.000", desc: "Harga sewa per sesi" },
  { icon: Sparkles, label: "Kebersihan", price: "Rp 50.000", desc: "Biaya kebersihan lapangan" },
  { icon: Shield, label: "Keamanan", price: "Rp 50.000", desc: "Biaya keamanan area" },
  { icon: Droplets, label: "Air", price: "Rp 50.000", desc: "Fasilitas air bersih" },
];

const PriceSection = () => {
  return (
    <section id="harga" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Transparan</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-wider text-foreground mt-2">
            RINCIAN HARGA
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Harga transparan tanpa biaya tersembunyi. Total Rp 200.000 per sesi.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {priceItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <span className="font-heading text-2xl text-accent">{item.price}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-xl p-6 text-center"
          >
            <p className="text-primary-foreground/70 text-sm mb-1">Total Biaya per Sesi</p>
            <p className="text-5xl font-heading tracking-wider text-secondary">RP 200.000</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
