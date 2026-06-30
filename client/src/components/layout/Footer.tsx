import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';
import pixelForgeLogo from '../../assets/logo-pixel-forge.png';

const Footer = () => {
  const socialLinks = [
    { Icon: FiGithub, href: '#', label: 'GitHub' },
    { Icon: FiTwitter, href: '#', label: 'Twitter' },
    { Icon: FiMail, href: '#', label: 'Email us' },
  ];

  return (
    <footer aria-label="Site footer" className="relative mt-20 border-t border-glass-border bg-dark-900/80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-luxury-cyan/50 group-hover:scale-105 transition-all duration-500 overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={pixelForgeLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div>
                <p className="font-heading text-base font-black tracking-[0.25em] text-white group-hover:text-luxury-cyan transition-colors">
                  PIXEL<span className="text-luxury-violet">FORGE</span>
                </p>
                <p className="text-[9px] tracking-[0.4em] text-luxury-cyan font-bold uppercase opacity-80 mt-0.5">
                  Omega Play Store
                </p>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-medium max-w-sm">
              Premium gaming marketplace for the next generation of players. Hand-selected luxury gear and elite builds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:pl-8 lg:pl-16">
            <h2 className="font-heading text-xs tracking-[0.3em] text-white uppercase font-black opacity-90">Shop</h2>
            <ul className="space-y-3">
              {['All Games', 'New Releases', 'Top Rated', 'On Sale'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-xs text-text-secondary hover:text-luxury-cyan hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h2 className="font-heading text-xs tracking-[0.3em] text-white uppercase font-black opacity-90">Support</h2>
            <ul className="space-y-3">
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQ', to: '/contact' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-xs text-text-secondary hover:text-luxury-cyan hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h2 className="font-heading text-xs tracking-[0.3em] text-white uppercase font-black opacity-90">Connect</h2>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 rounded-2xl glasswave border border-white/10 flex items-center justify-center text-text-secondary hover:text-luxury-cyan hover:border-luxury-cyan/40 hover:bg-luxury-cyan/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-text-muted font-medium tracking-wide text-center md:text-left">
            &copy; {new Date().getFullYear()} Pixel Forge Omega Play. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1.5 font-medium tracking-wide">
            Made with <FiHeart className="text-luxury-violet animate-pulse" size={14} aria-hidden="true" /> by Pixel Forge Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
