import { motion } from "framer-motion";
import { Clock, Ban, ShieldCheck, Shirt, UtensilsCrossed } from "lucide-react";

const sopItems = [
  { icon: Clock, text: "Datang 15 menit sebelum jadwal dimulai", highlight: "15 menit sebelum" },
  { icon: ShieldCheck, text: "Booking tidak hangus jika terlambat", highlight: "tidak hangus" },
  { icon: Ban, text: "Jaga kebersihan area lapangan", highlight: "kebersihan" },
  { icon: UtensilsCrossed, text: "Dilarang membawa makanan ke area lapangan", highlight: "Dilarang" },
  { icon: Shirt, text: "Wajib menggunakan sepatu olahraga yang sesuai", highlight: "sepatu olahraga" },
];

const SOPSection = () => {
  return (
    <section id="sop" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Peraturan</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-wider text-foreground mt-2">
            SOP LAPANGAN
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Patuhi aturan demi kenyamanan bersama.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {sopItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground font-medium">{item.text}</p>
              <span className="ml-auto shrink-0 text-2xl font-heading text-muted-foreground/30">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SOPSection;
