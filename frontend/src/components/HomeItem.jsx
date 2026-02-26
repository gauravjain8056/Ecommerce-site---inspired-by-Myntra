import { useSelector, useDispatch } from "react-redux";
import { bagActions } from "../store/bagSlice";

const HomeItem = ({ item }) => {
  const auth = useSelector((store) => store.auth);
  const cartItems = useSelector((store) => store.bag);
  const dispatch = useDispatch();

  const role = auth.user?.role; // "seller" | "customer" | undefined (guest)
  const inCart = cartItems.some((c) => c.productId === item._id);

  const handleAddToCart = () => {
    dispatch(bagActions.addToBag(item));
  };

  const handleRemoveFromCart = () => {
    dispatch(bagActions.removeFromBag(item._id));
  };

  return (
    <div className="item-container">
      <img className="item-image" src={item.image} alt="item image" />
      <div className="rating">
        {item.rating?.stars ?? "★"} ⭐ | {item.rating?.count ?? 0}
      </div>
      <div className="company-name">{item.company || item.category}</div>
      <div className="item-name">{item.name || item.item_name}</div>
      <div className="price">
        <span className="current-price">₹ {item.price || item.current_price}</span>
        {(item.originalPrice || item.original_price) && (
          <span className="original-price">
            ₹ {item.originalPrice || item.original_price}
          </span>
        )}
        {item.discount_percentage && (
          <span className="discount">({item.discount_percentage}% OFF)</span>
        )}
      </div>

      {/* ── Role-based action button ── */}
      {role === "seller" ? (
        <div
          style={{
            padding: "8px 0",
            fontSize: 12,
            color: "#999",
            textAlign: "center",
          }}
        >
          Listed by you
        </div>
      ) : role === "customer" ? (
        inCart ? (
          <button
            className="btn-add-bag btn-red"
            onClick={handleRemoveFromCart}
          >
            Remove from Cart
          </button>
        ) : (
          <button
            className="btn-add-bag"
            style={{ background: "#ff3f6c", color: "#fff" }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )
      ) : (
        <button
          className="btn-add-bag"
          style={{ background: "#555", color: "#fff" }}
          onClick={() =>
            alert("Please login as a customer to add items to cart.")
          }
        >
          Login to Request
        </button>
      )}
    </div>
  );
};

export default HomeItem;
