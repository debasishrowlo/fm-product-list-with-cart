import { useEffect, useState } from "react"
import resolveConfig from "tailwindcss/resolveConfig"

import tailwindConfig from "@/../tailwind.config"
import data from "./data.json"

const config = resolveConfig(tailwindConfig)
const screens = config.theme.screens

type Product = {
  id: string
  image: {
    thumbnail: string
    mobile: string
    tablet: string
    desktop: string
  },
  name: string
  category: string
  price: number
}

type CartProduct = {
  id: string,
  name: string,
  price: number,
  quantity: number,
}

function App() {
  const [cart, setCart] = useState<CartProduct[]>([])
  const isCartEmpty = cart.length === 0

  const getTotalProductPrice = (product:CartProduct) => {
    return product.price * product.quantity
  }

  const orderTotal = cart.reduce((acc, product) => acc + getTotalProductPrice(product), 0)

  const addItem = (product:Product) => {
    setCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ])
  }

  const removeItem = (id:string) => {
    setCart(cart.filter(product => product.id !== id))
  }

  useEffect(() => {
    document.body.classList.add("bg-rose-50")

    return () => {
      document.body.classList.remove("bg-rose-50")
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-24 md:p-40 lg:px-0 lg:py-88 lg:flex lg:gap-32">
      <div className="grow">
        <h1 className="text-40 font-bold text-rose-900 lg:mt-0 lg:px-0">{data.category}</h1>
        <div className="mt-32 grid gap-y-24 md:grid-cols-3 md:gap-x-24 md:gap-y-32 lg:px-0">
          {data.products.map(product => {
            const inCart = cart.some(cartProduct => cartProduct.id === product.id)

            return (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-8">
                    {inCart && (
                      <div className="absolute inset-0 border-2 border-red rounded-8"></div>
                    )}
                    <picture>
                      <source media={`(min-width:${screens.lg})`} srcSet={product.image.desktop} />
                      <source media={`(min-width:${screens.md})`} srcSet={product.image.tablet} />
                      <img src={product.image.mobile} alt="" />
                    </picture>
                  </div>
                  <button
                    type="button"
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 p-12 flex justify-center border border-rose-400 bg-white rounded-full"
                    onClick={() => addItem(product)}
                  >
                    <img src="/assets/images/icon-add-to-cart.svg" alt="" />
                    <span className="ml-8 text-14 font-semibold text-rose-900">Add to Cart</span>
                  </button>
                </div>
                <div className="mt-38">
                  <p className="text-14 text-rose-500">{product.category}</p>
                  <p className="mt-4 font-semibold text-rose-900">{product.name}</p>
                  <p className="mt-4 font-semibold text-red">${product.price.toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-32 shrink-0 lg:w-384 lg:mt-0 lg:px-0">
        <div className="p-24 bg-white rounded-12">
          <p className="text-24 font-bold text-red">Your Cart ({cart.length})</p>
          {isCartEmpty ? (
            <div className="mt-24 py-16">
              <img src="/assets/images/illustration-empty-cart.svg" className="mx-auto" alt="" />
              <p className="mt-16 text-center text-14 font-semibold text-rose-500">Your added items will appear here</p>
            </div>
          ) : (
            <>
              <div className="mt-8">
                {cart.map(product => {
                  const totalProductPrice = getTotalProductPrice(product)

                  return (
                    <div
                      className="py-16 flex justify-between items-center border-t first:border-t-0 border-rose-100"
                      key={product.id}
                    >
                      <div>
                        <p className="text-14 font-semibold text-rose-900">{product.name}</p>
                        <div className="mt-8 flex">
                          <p className="text-14 font-semibold text-red">{product.quantity}x</p>
                          <p className="ml-16 text-14 text-rose-500">@{product.price.toFixed(2)}</p>
                          <p className="ml-8 text-14 font-semibold text-rose-500">${totalProductPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-20 h-20 flex items-center justify-center border border-rose-400 rounded-full"
                        onClick={() => removeItem(product.id)}
                      >
                        <img src="/assets/images/icon-remove-item.svg" alt="" />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 pt-24 flex justify-between items-center border-t border-rose-100">
                <p className="text-14 text-rose-900">Order total</p>
                <p className="text-24 font-bold text-rose-900">${orderTotal.toFixed(2)}</p>
              </div>
              <div className="mt-24 py-16 flex justify-center items-center bg-rose-50 rounded-8">
                <img src="/assets/images/icon-carbon-neutral.svg" alt="" />
                <p className="ml-8 text-14 text-rose-900">
                  This is a <span className="font-semibold">carbon-neutral</span> delivery
                </p>
              </div>
              <button type="button" className="w-full mt-24 py-16 bg-red font-semibold text-white rounded-full">Confirm Order</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
