import { useDispatch, useSelector } from "react-redux";
import { fetchActions } from "../store/fetchStatusSlice";
import { itemsActions } from "../store/itemsSlice";
import { useEffect } from "react";

const FetchStatus = () => {
  const currFetchStatus = useSelector((store) => store.fetch);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currFetchStatus.fetchStatus) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchActions.fetchingStarted());
    fetch("https://ecommerce-site-inspired-by-myntra.onrender.com/items", {
      signal,
    })
      .then((res) => res.json())
      .then(({ items }) => {
        dispatch(fetchActions.setFetchStatus());
        dispatch(fetchActions.fetchingStopped());
        dispatch(itemsActions.addInitialItems(items));
      });

    return () => {
      controller.abort();
    };
  }, [currFetchStatus]);

  return <></>;
};

export default FetchStatus;
