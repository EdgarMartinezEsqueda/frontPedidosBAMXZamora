import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} Banco de Alimentos de Zamora A.C.
        </p>

        <div className="flex items-center -mx-2">
          <a href="/tickets/nuevo" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-verdeLogo" aria-label="Soporte" >
            <MdSupportAgent className="text-lg" />
          </a>
          <a href="https://www.facebook.com/p/Banco-de-Alimentos-de-Zamora-AC-100068378567561/" target="_blank" rel="noreferrer" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Facebook" >
            <FaFacebook />
          </a>

          <a href="https://instagram.com/bazac_" target="_blank" rel="noreferrer" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Instagram" >
            <FaInstagram />
          </a>

          <a href="https://www.youtube.com/@BancodeAlimentosdeZamora/videos" target="_blank" rel="noreferrer" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Linkedin" >
            <FaYoutube />
          </a>

          <a href="https://www.tiktok.com/@bancodealimentosdzamora" target="_blank" rel="noreferrer" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Linkedin" >
            <FaTiktok />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;