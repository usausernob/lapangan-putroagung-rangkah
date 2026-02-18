import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, X, Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const COURT_LABELS: Record<string, string> = {
  voli: "🏐 Voli",
  basket: "🏀 Basket",
  soccer: "⚽ Mini Soccer",
};

interface BookingReceiptProps {
  booking: {
    id: string;
    court_id: string;
    booking_date: string;
    time_slot: string;
    amount: number;
    payment_status: string;
    created_at: string;
  };
  userName: string;
  onClose: () => void;
}

const BookingReceipt = ({ booking, userName, onClose }: BookingReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!receiptRef.current) return;

    // Build a printable HTML receipt and trigger download
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nota Booking - ${booking.id.slice(0, 8)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 500px; margin: 0 auto; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; letter-spacing: 3px; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #666; }
    .status { text-align: center; margin: 16px 0; padding: 8px; border-radius: 8px; font-weight: bold; font-size: 14px; }
    .status.paid { background: #dcfce7; color: #166534; }
    .status.pending { background: #fef9c3; color: #854d0e; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .row .label { color: #666; }
    .row .value { font-weight: 600; }
    .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
    .total { font-size: 18px; font-weight: bold; }
    .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #ccc; font-size: 11px; color: #999; }
    .sop { margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px; font-size: 12px; }
    .sop h4 { font-size: 13px; margin-bottom: 8px; }
    .sop li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PUTROAGUNG</h1>
    <p>Lapangan Olahraga</p>
    <p>Putroagung, Surabaya, Jawa Timur</p>
  </div>
  <div class="status ${booking.payment_status === "paid" ? "paid" : "pending"}">
    ${booking.payment_status === "paid" ? "✅ LUNAS" : "⏳ BELUM BAYAR"}
  </div>
  <div class="row"><span class="label">No. Booking</span><span class="value">${booking.id.slice(0, 8).toUpperCase()}</span></div>
  <div class="row"><span class="label">Nama</span><span class="value">${userName}</span></div>
  <div class="row"><span class="label">Lapangan</span><span class="value">${COURT_LABELS[booking.court_id] || booking.court_id}</span></div>
  <div class="row"><span class="label">Tanggal</span><span class="value">${format(new Date(booking.booking_date), "dd MMMM yyyy", { locale: idLocale })}</span></div>
  <div class="row"><span class="label">Waktu</span><span class="value">${booking.time_slot}</span></div>
  <div class="divider"></div>
  <div class="row"><span class="label">Sewa Lapangan</span><span class="value">Rp 100.000</span></div>
  <div class="row"><span class="label">Kebersihan</span><span class="value">Rp 50.000</span></div>
  <div class="row"><span class="label">Keamanan</span><span class="value">Rp 50.000</span></div>
  <div class="divider"></div>
  <div class="row total"><span>Total</span><span>Rp ${booking.amount.toLocaleString("id-ID")}</span></div>
  <div class="sop">
    <h4>📋 SOP Penggunaan Lapangan:</h4>
    <ol>
      <li>Datang 15 menit sebelum jadwal dimulai</li>
      <li>Booking tidak hangus jika terlambat</li>
      <li>Wajib menjaga kebersihan lapangan</li>
      <li>Dilarang membawa makanan ke area lapangan</li>
      <li>Gunakan sepatu olahraga yang sesuai</li>
    </ol>
  </div>
  <div class="footer">
    <p>Terima kasih telah memesan di Putroagung!</p>
    <p>Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale })}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nota-booking-${booking.id.slice(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-heading tracking-wider text-foreground">NOTA BOOKING</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div ref={receiptRef}>
          {/* Status */}
          <div className={`text-center py-2 px-4 rounded-xl mb-4 text-sm font-bold ${
            booking.payment_status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {booking.payment_status === "paid" ? (
              <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> LUNAS</span>
            ) : "BELUM BAYAR"}
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">No. Booking</span>
              <span className="font-mono font-semibold text-foreground">{booking.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Lapangan</span>
              <span className="font-semibold text-foreground">{COURT_LABELS[booking.court_id] || booking.court_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal</span>
              <span className="font-semibold text-foreground">{format(new Date(booking.booking_date), "dd MMMM yyyy", { locale: idLocale })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Waktu</span>
              <span className="font-semibold text-foreground">{booking.time_slot}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between"><span className="text-muted-foreground">Sewa Lapangan</span><span className="font-semibold text-foreground">Rp 100.000</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Kebersihan</span><span className="font-semibold text-foreground">Rp 50.000</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Keamanan</span><span className="font-semibold text-foreground">Rp 50.000</span></div>
            <hr className="border-border" />
            <div className="flex justify-between text-lg">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-accent">Rp {booking.amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* SOP */}
          <div className="bg-muted rounded-xl p-4 mt-4">
            <h4 className="font-bold text-foreground mb-2 text-xs uppercase tracking-wider">📋 SOP Penggunaan Lapangan</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>1. Datang <strong className="text-foreground">15 menit sebelum</strong> jadwal</li>
              <li>2. Booking <strong className="text-foreground">tidak hangus</strong> jika terlambat</li>
              <li>3. Wajib menjaga <strong className="text-foreground">kebersihan lapangan</strong></li>
              <li>4. Dilarang membawa <strong className="text-foreground">makanan ke area lapangan</strong></li>
              <li>5. Gunakan <strong className="text-foreground">sepatu olahraga</strong> yang sesuai</li>
            </ul>
          </div>
        </div>

        {/* Download Button */}
        <Button variant="hero" className="w-full mt-4" onClick={handleDownload}>
          <Download className="w-4 h-4" /> Download Nota
        </Button>
      </motion.div>
    </div>
  );
};

export default BookingReceipt;
