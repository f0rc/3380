import { useContext } from "react";
import CartContext from "../context/CartProvider";
import { userCartContextType } from "../context/CartProvider";

const useCart = (): userCartContextType => {
    return useContext(CartContext)
}

export default useCart