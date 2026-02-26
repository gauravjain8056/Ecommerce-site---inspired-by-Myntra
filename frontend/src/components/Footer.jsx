import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";

const Footer = () => {
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  return (
    <footer>
      <div className="footer_container">
        <div className="footer_column">
          <h3>ONLINE SHOPPING</h3>
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Kids</a>
          <a href="#">Home &amp; Living</a>
          <a href="#">Beauty</a>
        </div>

        <div className="footer_column">
          <h3>USEFUL LINKS</h3>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
          <a href="#">T&amp;C</a>
          <a href="#">Terms of Use</a>
          <a href="#">Track Orders</a>
          <a href="#">Shipping</a>
        </div>

        <div className="footer_column">
          <h3>MY ACCOUNT</h3>
          {auth.user ? (
            <>
              <span style={{ color: "#282c3f", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Hello, {auth.user.name}
              </span>
              {auth.user.role === "customer" && (
                <Link to="/my-requests" style={{ color: "#696b79", fontSize: 15, textDecoration: "none", paddingBottom: 5 }}>
                  My Requests
                </Link>
              )}
              {auth.user.role === "seller" && (
                <Link to="/seller/dashboard" style={{ color: "#696b79", fontSize: 15, textDecoration: "none", paddingBottom: 5 }}>
                  Seller Dashboard
                </Link>
              )}
              <Link to="/bag" style={{ color: "#696b79", fontSize: 15, textDecoration: "none", paddingBottom: 5 }}>
                My Cart
              </Link>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); dispatch(logout()); }}
                style={{ color: "#ff3f6c", fontSize: 15, fontWeight: 600, textDecoration: "none", paddingBottom: 5, cursor: "pointer" }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <span style={{ color: "#696b79", fontSize: 14 }}>
                Login to access your account
              </span>
            </>
          )}
        </div>
      </div>
      <hr />
      <div className="copyright">
        © {new Date().getFullYear()} B2B Marketplace. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
