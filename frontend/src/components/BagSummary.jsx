import { useSelector } from "react-redux";

const BagSummary = ({}) => {
  const bagItems = useSelector((store) => store.bag);
  const items = useSelector((store) => store.items);
  const CONVENIENCE_FEES = 99;

  let bagSummary = {
    totalItem: bagItems.length,
    totalMRP: 0,
    totalDiscount: 0,
    finalPayment: 0,
  };
  const finalItems = items.filter((item1) => {
    const itemIndex = bagItems.indexOf(item1.id);
    return itemIndex >= 0;
  });

  finalItems.forEach((bagItem) => {
    bagSummary.totalMRP += bagItem.original_price;
    bagSummary.totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  bagSummary.finalPayment =
    bagSummary.totalMRP - bagSummary.totalDiscount + CONVENIENCE_FEES;

  return (
    <div className="bag-summary">
      <div className="bag-details-container">
        <div className="price-header">
          PRICE DETAILS ({bagSummary.totalItem} Items){" "}
        </div>
        <div className="price-item">
          <span className="price-item-tag">Total MRP</span>
          <span className="price-item-value">₹{bagSummary.totalMRP}</span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Discount on MRP</span>
          <span className="price-item-value priceDetail-base-discount">
            -₹{bagSummary.totalDiscount}
          </span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Convenience Fee</span>
          <span className="price-item-value">₹99</span>
        </div>
        <hr />
        <div className="price-footer">
          <span className="price-item-tag">Total Amount</span>
          <span className="price-item-value">₹{bagSummary.finalPayment}</span>
        </div>
      </div>
      <button className="btn-place-order">
        <div className="css-xjhrni">PLACE ORDER</div>
      </button>
    </div>
  );
};

export default BagSummary;
