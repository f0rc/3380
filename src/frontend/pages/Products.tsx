import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Button, Col, Row, Card } from "react-bootstrap"
import { createContext, ReactNode, useContext, useState } from "react"

const items = [
    {
        id: 1,
        name: "Stamps",
        price: .25,
        imgUrl: "https://cdn.staticswin.com/uploads/39817/cart/resources/20230218/AD143B45-C2D3-E566-33E8-8EAFC5D646DC.jpg"
    },
    {
        id: 2,
        name: "Scotch Tape",
        price: 2.99,
        imgUrl: "https://multimedia.3m.com/mws/media/1318883P/scotch-shipping-packaging-tape-heavy-duty.jpg"
    },
    {
        id: 3,
        name: "Letter Envelopes",
        price: .99,
        imgUrl: "https://media.officedepot.com/images/f_auto,q_auto,e_sharpen,h_450/products/219330/219330_o01_081021/219330"
    },
    {
        id: 4,
        name: "Manilla Envelopes",
        price: 1.99,
        imgUrl: "https://images.squarespace-cdn.com/content/v1/57c4f32d15d5db84098dd95a/1491793761282-33BLO9BF5JNXTGTAPD56/IMG_6386.jpg?format=1000w"
    },
    {
        id: 5,
        name: "Small Box",
        price: 3.99,
        imgUrl: "https://www.usps.com/c360/images/Small-FRB-0713.png?_gl=1*qjml5s*_ga*MTMxMTkzODA0NS4xNjc4ODUxMjEx*_ga_3NXP3C8S9V*MTY3ODg1MTIxMS4xLjAuMTY3ODg1MTIxMS4wLjAuMA.."
    },
    {
        id: 6,
        name: "Medium Box",
        price: 5.99,
        imgUrl: "https://www.usps.com/ecp/asset/images/O_FRB1-T0.jpg"
    },
    {
        id: 7,
        name: "Large Box",
        price: 7.99,
        imgUrl: "https://images.thdstatic.com/productImages/50302b46-831e-47ba-9584-3b8ffc9b266d/svn/pratt-retail-specialties-moving-boxes-lgmvbox10pk-64_300.jpg"
    }
]

type StoreItemProps = {
    id: number
    name: string
    price: number
    imgUrl: string
}
//Conponent, creates format for each item we have for sell including buttons to add to cart or remove from cart
export function StoreItem({ id, name, price, imgUrl }: StoreItemProps){
    const {
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart, 
    } = useShoppingCart()
    const quantity = getItemQuantity(id)
    return (
        <Card className="h-100">
            <Card.Img
                variant="top"
                src={imgUrl}
                height="200px" 
                style={{ objectFit: "cover" }} 
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
                    <span className="fs-2">{name}</span>
                    <span className="ms-2 text-muted">{formatCurrency(price)}</span>
                </Card.Title>
                <div className="mt-auto">
                    {quantity === 0 ? (
                        <Button className="w-100" onClick={() => increaseCartQuantity(id)}>
                            + Add To Cart
                        </Button>
                    ) : (
                        <div
                            className="d-flex align-items-center flex-column"
                            style={{ gap: ".5rem"}}
                        >
                            <div
                                className="d-flex algin-items-center"
                                style={{ gap: ".5rem" }}
                            >
                                <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                                <div>
                                    <span className="fs-3">{quantity}</span> in cart
                                </div>
                                <Button onClick={() => increaseCartQuantity(id)}>+</Button>
                            </div>
                            <Button onClick={() => removeFromCart(id)} variant="danger" size="sm">
                                Remove
                            </Button>
                        </div>)}
                </div>
            </Card.Body>
        </Card>
    )
}
//location of customer, it changes currency to their local area
const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "USD", style: "currency" })
//formats the currency to the correct format
export function formatCurrency(number: number) {
    return CURRENCY_FORMATTER.format(number)
}


type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem= {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1}]
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity == 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

    return(
        <ShoppingCartContext.Provider value={{ getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart}}>
            {children}
        </ShoppingCartContext.Provider>
    )
}

//Items we sell on the product page
const Products = () => {
    return (
        <Container>
            <Button //Shopping cart for products
                style = {{ width: "3rem", height: "3rem", position: "relative"}} 
                variant="outline-primary"
                className="rounded-circle"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                >
                    <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />  
                </svg>
                <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                    style={{
                        color: "white",
                        width: "1.5rem",
                        height: "1.5rem",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        transform: "translate(25%, 25%)",
                        }}>
                    3
                </div>
            </Button>
            <h1>Store Items</h1>
            <Row md ={2} xs={1} lg={3} className="g-3">
                {items.map((item, index) => (
                    <Col key={index}>
                        <StoreItem {...item} />
                    </Col>
                ))}
            </Row>
        </Container>

    )
}
export default Products