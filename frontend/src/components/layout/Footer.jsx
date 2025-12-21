import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">  Marketplace</h2>  
            <p className="text-gray-400">© 2024 Marketplace. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link to="#" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white">
              <FaLinkedin size={24} />
            </Link>
          </div>
          {/* quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer Service */}
            <div>
            <h3 className="text-lg font-semibold mb-2">Customer Service</h3>
            <ul>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          {/*  legal  */}
            <div>
            <h3 className="text-lg font-semibold mb-2">Legal</h3>
            <ul>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/seller-terms" className="text-gray-400 hover:text-white">
                  Seller Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar  */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>© Copy;{new Date().getFullYear()} Designed and Developed by MB Team.  All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;