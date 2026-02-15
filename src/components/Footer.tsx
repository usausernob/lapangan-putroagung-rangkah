import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo-persebaya.png";

const Footer = () => {
  return (
    <footer className="gradient-hero py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              <span className="font-heading text-2xl text-secondary tracking-wider">PUTROAGUNG</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              Tempat olahraga terbaik dengan fasilitas modern dan harga terjangkau.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xl text-secondary tracking-wider mb-4">KONTAK</h4>
            <div className="space-y-3 text-sm text-primary-foreground/60">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> Putroagung, Surabaya</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /> +62 812-3456-7890</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /> info@putroagung.id</p>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-xl text-secondary tracking-wider mb-4">JAM OPERASIONAL</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>Senin - Minggu</p>
              <p className="text-secondary font-bold text-lg">07:00 - 20:00</p>
            </div>
          </div>
        </div>
        <hr className="border-green-light/20 mb-6" />
        <p className="text-center text-sm text-primary-foreground/40">
          © 2026 Lapangan Putroagung. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
