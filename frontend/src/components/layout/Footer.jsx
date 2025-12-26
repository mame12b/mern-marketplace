import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              🛒 Marketplace
            </h2>  
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted online marketplace for quality products, great deals, and exceptional service.
            </p>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400" />
                <span>support@marketplace.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>123 Market St, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> FAQ
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">Legal</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Cookie Policy
                </Link>
              </li>
            </ul>
            
            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all transform hover:scale-110">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all transform hover:scale-110">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all transform hover:scale-110">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all transform hover:scale-110">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Marketplace. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/sitemap" className="hover:text-blue-400 transition-colors">Sitemap</Link>
              <Link to="/accessibility" className="hover:text-blue-400 transition-colors">Accessibility</Link>
              <Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;