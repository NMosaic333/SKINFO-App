import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-white to-pink-50 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">
            Skinfo
          </h3>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Empowering conscious skincare choices through AI-powered ingredient analysis.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-pink-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">Scan Product</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">Skin Quiz</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">About Us</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Resources</h4>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-pink-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-pink-500 transition">Support</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Get in Touch</h4>
          <p className="text-gray-600 text-sm mb-4">
            Have questions or suggestions? We’d love to hear from you.
          </p>
          <a
            href="mailto:support@skinfo.ai"
            className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition"
          >
            <Mail size={18} /> support@skinfo.ai
          </a>

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            {[
              { icon: Instagram, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="p-2 bg-white border border-pink-100 rounded-full shadow-sm hover:shadow-md hover:bg-pink-50 transition"
              >
                <Icon size={18} className="text-pink-500" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="font-semibold text-pink-600">Skinfo</span>. All rights reserved.
      </div>
    </footer>
  );
}
