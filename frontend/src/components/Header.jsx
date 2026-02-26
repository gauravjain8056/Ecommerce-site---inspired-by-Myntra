import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { IoBagHandle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
import { logout } from "../store/authSlice";
import AuthModal from "./AuthModal";

const CATEGORIES = ["Men", "Women", "Kids", "Home & Living", "Beauty", "Studio"];

const Header = () => {
  const bag = useSelector((store) => store.bag);
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const isSeller = auth.user?.role === "seller";
  const isCustomer = auth.user?.role === "customer";
  const cartCount = bag.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  const handleLogoClick = () => {
    setActiveCategory(null);
    navigate("/");
  };

  return (
    <>
      <header>
        <div className="logo_container">
          <Link to="/" onClick={handleLogoClick}>
            <img
              className="myntra_home"
              src="/images/myntra_logo.webp"
              alt="Home"
            />
          </Link>
        </div>
        <nav className="nav_bar">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href="#"
              className={activeCategory === cat ? "active-category" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(cat);
              }}
            >
              {cat}
            </a>
          ))}
        </nav>
        <div className="search_bar">
          <span className="search-icon">
            <CiSearch />
          </span>
          <input
            className="search_input"
            placeholder="Search for products, brands and more"
          />
        </div>
        <div className="action_bar">
          {isSeller && (
            <Link className="action_container" to="/seller/dashboard">
              <MdDashboard />
              <span className="action_name">Dashboard</span>
            </Link>
          )}

          {isCustomer && (
            <Link className="action_container" to="/my-requests">
              <FiClipboard />
              <span className="action_name">My Requests</span>
            </Link>
          )}

          {auth.user ? (
            <div
              className="action_container"
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(logout())}
              title="Click to logout"
            >
              <IoPerson />
              <span className="action_name">Logout</span>
            </div>
          ) : (
            <div
              className="action_container"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAuth(true)}
            >
              <IoPerson />
              <span className="action_name">Login</span>
            </div>
          )}

          <Link className="action_container" to="/bag">
            <IoBagHandle />
            <span className="action_name">Bag</span>
            <span className="bag-item-count">{cartCount}</span>
          </Link>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Header;
