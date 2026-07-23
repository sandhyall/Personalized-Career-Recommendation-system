import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/image.png";
import { clearSession, getSession, isLoggedIn } from "../../utils/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    setName(getSession().name);
    setMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    clearSession();
    setAuthed(false);
    navigate("/");
  };

  const guestLinks = (
    <>
      <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        Home
      </Link>
      <Link to="/about" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        About
      </Link>
      <Link to="/contact" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        Contact
      </Link>
    </>
  );

  const authLinks = (
    <>
      <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        Dashboard
      </Link>
      <Link to="/result" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        My Results
      </Link>
      <Link to="/get-started" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        Retake Assessment
      </Link>
      <Link to="/dashboard/profile" className="text-gray-700 font-medium hover:text-indigo-600 transition">
        Profile
      </Link>
    </>
  );

  return (
    <header className="bg-amber-50 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to={authed ? "/dashboard" : "/"} className="flex items-center">
          <img src={logo} alt="logo" className="h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {authed ? authLinks : guestLinks}

          <div className="flex items-center space-x-3 ml-4">
            {authed ? (
              <>
                <span className="text-sm text-gray-600 hidden lg:inline">
                  Hi, <strong>{name}</strong>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-5 py-2 border border-black font-bold text-black rounded-lg hover:bg-indigo-700 hover:text-white hover:border-indigo-700 transition"
                >
                  Logout
                </button>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 text-white bg-black rounded-lg hover:bg-indigo-700 shadow-md transition"
                >
                  Continue
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 border border-black font-bold text-black rounded-lg hover:bg-indigo-700 hover:text-white hover:border-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-white bg-black rounded-lg hover:bg-indigo-700 shadow-md transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="md:hidden text-sm font-bold border border-black px-3 py-2 rounded-lg"
          onClick={() => setMenuOpen((o) => !o)}
        >
          Menu
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-amber-100 px-6 py-4 space-y-3 bg-amber-50">
          {authed ? (
            <>
              <Link to="/dashboard" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/result" className="block font-medium" onClick={() => setMenuOpen(false)}>
                My Results
              </Link>
              <Link to="/get-started" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Retake Quiz
              </Link>
              <Link to="/profile" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button type="button" onClick={logout} className="block font-bold text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="block font-medium" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="/login" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block font-medium" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
