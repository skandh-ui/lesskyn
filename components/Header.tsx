"use client";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import { useRouter, usePathname } from "next/navigation";
import profile from "@/public/assets/profile.svg";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/actions/auth";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  const pathname = usePathname();

  // --- SCROLL LOGIC START ---
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Determine if we are at the very top (allow 10px buffer)
      if (currentScrollY < 10) {
        setIsAtTop(true);
        // Always show header when at the very top
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        // 2. Determine scroll direction
        if (currentScrollY > lastScrollY.current) {
          // Scrolling DOWN -> Hide Header
          setIsVisible(false);
        } else {
          // Scrolling UP -> Show Header
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // --- SCROLL LOGIC END ---

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform 
      ${
        // Toggle visibility (Slide up/down)
        isVisible ? "translate-y-0" : "-translate-y-full"
      } 
      ${
        // Toggle Background Style
        isAtTop
          ? "bg-transparent border-transparent" // Transparent at top
          : "bg-white/80 backdrop-blur-md border-b border-black/10 shadow-sm" // White/Blur when scrolling
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 pt-3 pb-3 flex items-center justify-between">
        {/* LOGO SECTION */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          {
            <>
              {/* MOBILE = always show logo */}
              <Image
                src={logo}
                alt="LesSkyn Logo"
                className="w-8 h-8 sm:w-10 sm:h-12 object-contain md:hidden"
              />
              <span className="block md:hidden font-montserrat text-[13px] font-medium leading-none ">
                LesSkyn
              </span>
              {/* DESKTOP = show only when mode === 'dark' */}
              {
                <>
                  <Image
                    src={logo}
                    alt="LesSkyn Logo"
                    className="w-8 h-8 sm:w-10 sm:h-12 object-contain hidden md:block"
                  />
                  <span className="hidden md:block font-montserrat text-2xl font-semibold leading-none">
                    LesSkyn
                  </span>
                </>
              }
            </>
          }
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-black">
          <Link
            href="/about-us"
            className={
              pathname === "/about-us" ? "text-black font-bold" : "text-black/50"
            }
          >
            About
          </Link>

          <Link
            href="/quiz"
            className={
              pathname === "/quiz" ? "text-black font-bold" : "text-black/50"
            }
          >
            Quiz
          </Link>

          <Link
            href="/dermat"
            className={
              pathname === "/dermat" ? "text-black font-bold" : "text-black/50"
            }
          >
            Dermats
          </Link>

          <Link
            href="/booking"
            className={
              pathname === "/booking" ? "text-black font-bold" : "text-black/50"
            }
          >
            Skin Besties
          </Link>

          {session?.user?.id ? (
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Image
                  src={profile}
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-12 object-contain"
                />
              </div>

              {/* Profile Dropdown */}
              {profileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      navigate("/dashboard");
                    }}
                    className="w-full px-4 py-2 cursor-pointer text-left text-black hover:bg-gray-100 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      setProfileDropdown(false);
                      await logout();
                    }}
                    className="w-full px-4 cursor-pointer py-2 text-left text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/sign-in")}
              className="px-6 py-2 bg-black cursor-pointer text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-black text-xl sm:text-2xl"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-4 mt-2 z-50">
            <div className="w-52 rounded-xl shadow-lg p-4 bg-white text-black border border-gray-100">
              <nav className="flex flex-col gap-4 text-base">
                <Link href="/about-us" onClick={() => setOpen(false)}>
                  About
                </Link>
                <Link href="/quiz" onClick={() => setOpen(false)}>
                  Quiz
                </Link>
                <Link href="/booking" onClick={() => setOpen(false)}>
                  Skin Besties
                </Link>
                {session?.user?.id ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={profile}
                      alt="Profile"
                      className="w-6 h-6 object-contain"
                    />
                    <span>Profile</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/sign-in");
                    }}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-left"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
