"use client";

import Link from "next/link";
import { FiFacebook, FiXTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import Logo from "@/components/brand/Logo";

const footerLinks = {
  explore: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Login", href: "/login" },
    { label: "Forgot PIN", href: "/forgot-password" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socials = [
  // { icon: FiFacebook, href: "#", label: "Facebook" },
  // { icon: FiXTwitter, href: "#", label: "X" },
  { icon: FiInstagram, href: "https://www.instagram.com/maekandex_communication_/", label: "Instagram" },
  { icon: FiLinkedin, href: "https://ng.linkedin.com/company/maekandexcommunication", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[radial-gradient(ellipse_80%_80%_at_80%_0%,#CDEBB0_0%,transparent_55%),linear-gradient(200deg,#8DC63F_0%,#00A651_55%,#00863F_100%)] text-ink p-4 py-8">
      
      {/* Main Grid Section */}
      <div className="container-xl mx-auto px-4 md:px-6 pt-16 pb-12">
        {/* Fixed Grid: 1 col on mobile, 4 cols on md/lg to prevent awkward tablet wrapping */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info Column - Spans 2 columns on larger screens */}
          <div className="md:col-span-2 flex flex-col items-start">
            <Logo variant="dark" size="md" />
            <p className="mt-5 text-[15px] leading-relaxed max-w-sm text-ink/80">
              Nigeria&apos;s job discovery platform. Subscribe via <strong className="text-[#055A2B] font-extrabold tracking-wide">*7098#</strong>, browse live listings, and land your next role.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-ink mb-5">
              Explore
            </h3>
            <div className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-[15px] text-ink/75 font-medium w-fit no-underline py-1 transition-all duration-200 hover:text-ink hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-ink mb-5">
              Company
            </h3>
            <div className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-[15px] text-ink/75 font-medium w-fit no-underline py-1 transition-all duration-200 hover:text-ink hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
        <div className="container-xl mx-auto px-4 md:px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-5 py-6">
          <p className="text-[14px] text-ink/70 m-0 text-center sm:text-left">
            &copy; {new Date().getFullYear()} JustJobNG. All rights reserved.
          </p>
          
          {/* Social Icons Strip */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a 
                key={label} 
                href={href} 
                aria-label={label} 
                target="_blank"           // Important for external links
                rel="noopener noreferrer" // Security best practice
                className="w-10 h-10 rounded-full flex items-center justify-center bg-ink/5 text-ink/75 transition-all duration-300 hover:bg-ink hover:text-gold-hover hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
    </footer>
  );
}