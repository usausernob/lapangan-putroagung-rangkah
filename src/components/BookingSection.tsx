import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { id } from "date-fns/locale";

const SPORTS = ["Voli", "Basket", "Mini Soccer"] as const;
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = 7 + i;
  return `${hour.toString().padStart(2, "0")}:00`;
});

// Mock bookings: track how many bookings per sport/date/time
const generateMockBookings = (): Record<string, number> => {
  const bookings: Record<string, number> = {};
  // Simulate some existing bookings
  const today = startOfDay(new Date());
  SPORTS.forEach((sport) => {
    for (let d = 0; d < 7; d++) {
      const date = format(addDays(today, d), "yyyy-MM-dd");
      TIME_SLOTS.forEach((time) => {
        const key = `${sport}-${date}-${time}`;
        bookings[key] = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      });
    }
  });
  return bookings;
};

const BookingSection = () => {
  const [selectedSport, setSelectedSport] = useState<typeof SPORTS[number]>("Mini Soccer");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSOP, setShowSOP] = useState(false);

  const mockBookings = useMemo(() => generateMockBookings(), []);

  const dates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  const getDayBookingCount = (sport: string) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return Object.entries(mockBookings)
      .filter(([key]) => key.startsWith(`${sport}-${dateStr}-`))
      .reduce((sum, [, count]) => sum + count, 0);
  };

  const isSportFullForDay = (sport: string) => getDayBookingCount(sport) >= 3;

  const handleBooking = () => {
    if (!selectedTime) return;
    setShowPayment(true);
  };

  const handlePayment = () => {
    setShowPayment(false);
    setShowSOP(true);
    setSelectedTime(null);
  };

  return (
    <section id="booking" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Reservasi</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-wider text-foreground mt-2">
            BOOKING LAPANGAN
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Pilih lapangan, tanggal, dan jam yang tersedia. Maksimal 3 booking per slot.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Sport Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-3 justify-center mb-8 flex-wrap"
          >
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => { setSelectedSport(sport); setSelectedTime(null); }}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedSport === sport
                    ? "bg-primary text-secondary shadow-lg scale-105"
                    : "bg-card text-foreground border border-border hover:border-accent/50"
                }`}
              >
                {sport === "Voli" ? "🏐" : sport === "Basket" ? "🏀" : "⚽"} {sport}
              </button>
            ))}
          </motion.div>

          {/* Date Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 justify-center mb-8 overflow-x-auto pb-2 flex-wrap"
          >
            {dates.map((date) => {
              const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[70px] transition-all duration-300 ${
                    isSelected
                      ? "bg-primary text-secondary shadow-lg"
                      : "bg-card text-foreground border border-border hover:border-accent/50"
                  }`}
                >
                  <span className="text-xs font-medium opacity-70">
                    {format(date, "EEE", { locale: id })}
                  </span>
                  <span className="text-lg font-bold">{format(date, "dd")}</span>
                  <span className="text-xs opacity-70">{format(date, "MMM")}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8"
          >
            {TIME_SLOTS.map((time) => {
              const full = isSportFullForDay(selectedSport);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  disabled={full}
                  onClick={() => setSelectedTime(isSelected ? null : time)}
                  className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                    full
                      ? "bg-destructive/10 text-muted-foreground cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-primary text-secondary shadow-lg scale-105"
                      : "bg-card text-foreground border border-border hover:border-accent/50"
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <span className="text-sm font-bold">{time}</span>
                  <div className="text-[10px] mt-1 opacity-70">
                    {full ? "Penuh" : "Tersedia"}
                  </div>
                  {full && (
                    <span className="text-[10px] text-destructive font-semibold">Penuh</span>
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Book Button */}
          <div className="text-center">
            <Button
              variant="hero"
              size="lg"
              disabled={!selectedTime}
              onClick={handleBooking}
              className="text-base px-12"
            >
              <MapPin className="w-5 h-5" />
              {selectedTime
                ? `Pesan ${selectedSport} - ${format(selectedDate, "dd MMM")} ${selectedTime}`
                : "Pilih waktu terlebih dahulu"}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPayment(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-heading tracking-wider text-foreground mb-4">RINCIAN BIAYA</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">📍 {selectedSport}</span>
                <span className="font-semibold text-foreground">{format(selectedDate, "dd MMMM yyyy", { locale: id })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">🕐 Waktu</span>
                <span className="font-semibold text-foreground">{selectedTime}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sewa Lapangan</span>
                <span className="font-semibold text-foreground">Rp 100.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kebersihan</span>
                <span className="font-semibold text-foreground">Rp 50.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Keamanan</span>
                <span className="font-semibold text-foreground">Rp 50.000</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-accent">Rp 200.000</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                Batal
              </Button>
              <Button variant="hero" className="flex-1" onClick={handlePayment}>
                Bayar Sekarang
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* SOP Modal */}
      {showSOP && (
        <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSOP(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-3xl font-heading tracking-wider text-foreground">BOOKING BERHASIL!</h3>
            </div>
            <div className="bg-muted rounded-xl p-4 mb-6">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" /> SOP Penggunaan Lapangan
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">1.</span>
                  Datang <strong className="text-foreground">15 menit sebelum</strong> jadwal dimulai
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">2.</span>
                  Booking <strong className="text-foreground">tidak hangus</strong> jika terlambat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">3.</span>
                  Wajib menjaga <strong className="text-foreground">kebersihan lapangan</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">4.</span>
                  Dilarang membawa <strong className="text-foreground">makanan ke area lapangan</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">5.</span>
                  Gunakan <strong className="text-foreground">sepatu olahraga</strong> yang sesuai
                </li>
              </ul>
            </div>
            <Button variant="hero" className="w-full" onClick={() => setShowSOP(false)}>
              Mengerti
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default BookingSection;
