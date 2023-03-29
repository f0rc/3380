import { createContext, ReactElement, useState, useEffect } from "react"

export type ProductType = {
    id: string, //was number before
    name: string,
    price: number,
    //imgUrl: string,
}


const initState: ProductType[] = [
    {
        //"id": 1,
        "id": "item0001",
        "name": "Stamps",
        "price": 0.25,
        //"imgUrl": "https://cdn.staticswin.com/uploads/39817/cart/resources/20230218/AD143B45-C2D3-E566-33E8-8EAFC5D646DC.jpg"
    },
    {
        "id": "item0002",
        "name": "Scotch Tape",
        "price": 2.99,
        //"imgUrl": "https://multimedia.3m.com/mws/media/1318883P/scotch-shipping-packaging-tape-heavy-duty.jpg"
    },
    {
        "id": "item0003",
        "name": "Letter Envelopes",
        "price": 0.99,
        //"imgUrl": "https://media.officedepot.com/images/f_auto,q_auto,e_sharpen,h_450/products/219330/219330_o01_081021/219330"
    },
    {
        "id": "item0004",
        "name": "Manilla Envelopes",
        "price": 1.99,
        //"imgUrl": "https://images.squarespace-cdn.com/content/v1/57c4f32d15d5db84098dd95a/1491793761282-33BLO9BF5JNXTGTAPD56/IMG_6386.jpg?format=1000w"
    },
    {
        "id": "item0005",
        "name": "Small Box",
        "price": 3.99,
        //"imgUrl": "https://www.usps.com/c360/images/Small-FRB-0713.png?_gl=1*qjml5s*_ga*MTMxMTkzODA0NS4xNjc4ODUxMjEx*_ga_3NXP3C8S9V*MTY3ODg1MTIxMS4xLjAuMTY3ODg1MTIxMS4wLjAuMA.."
    },
    {
        "id": "item0006",
        "name": "Medium Box",
        "price": 5.99,
        //"imgUrl": "https://www.usps.com/ecp/asset/images/O_FRB1-T0.jpg"
    },
    {
        "id": "item0007",
        "name": "Large Box",
        "price": 7.99,
        //"imgUrl": "https://images.thdstatic.com/productImages/50302b46-831e-47ba-9584-3b8ffc9b266d/svn/pratt-retail-specialties-moving-boxes-lgmvbox10pk-64_300.jpg"
    }
]

export type UseProductsContextType = { products: ProductType[]}

const initContextState: UseProductsContextType = { products: [] }

const ProductsContext = createContext<UseProductsContextType>(initContextState)

type ChildrenType = { children?: ReactElement | ReactElement[] }

export const ProductsProvider = ( { children }: ChildrenType):
ReactElement => {
    const [products, setProducts] = useState<ProductType[]>(initState)

    return (
        <ProductsContext.Provider value={{ products}}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsContext