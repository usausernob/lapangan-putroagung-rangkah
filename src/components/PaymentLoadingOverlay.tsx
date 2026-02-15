import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { emoji: "🔐", text: "Mengamankan transaksi..." },
  { emoji: "📡", text: "Menghubungi payment gateway..." },
  { emoji: "💳", text: "Menyiapkan halaman pembayaran..." },
];

interface PaymentLoadingOverlayProps {
  visible: boolean;
}

const PaymentLoadingOverlay = ({ visible }: PaymentLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="flex flex-col items-center gap-8 px-6"
          >
            {/* Animated rings */}
            <div className="relative w-28 h-28">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-accent/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-4 border-primary/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-4xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  💰
                </motion.span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h3 className="text-2xl font-heading tracking-wider text-foreground">
                MEMPROSES PEMBAYARAN
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Mohon tunggu sebentar...</p>
            </div>

            {/* Animated steps */}
            <div className="space-y-3 w-full max-w-xs">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 1.2, duration: 0.5 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 1.2 }}
                    className="text-xl"
                  >
                    {step.emoji}
                  </motion.span>
                  <span className="text-muted-foreground">{step.text}</span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: i * 1.2, duration: 1 }}
                    className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full"
                  />
                </motion.div>
              ))}
            </div>

            {/* Bouncing dots */}
            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentLoadingOverlay;
