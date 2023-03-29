import Header from "./components/Header"
import Footer from "./components/Footer"
import Cart from "./components/Cart"
import ProductList from "./components/ProductList"
import { useState } from "react"
import { ProductsProvider } from "./context/ProductsProvider"
import { CartProvider } from "./context/CartProvider"
import './shopping.css'
function ShoppingIndex() {
    const [viewCart, setViewCart] = useState<boolean>(false)

    const pageContent = viewCart ? <Cart /> : <ProductList />

    const content = (
        <>
        <ProductsProvider>
            <CartProvider>
                <Header viewCart={viewCart} setViewCart={setViewCart} />
                {pageContent}
                <Footer viewCart = {viewCart} />
            </CartProvider>
        </ProductsProvider>
        </>
    )
    return content
}

export default ShoppingIndex