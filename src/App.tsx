import { useEffect, useState, Fragment } from "react"
import resolveConfig from "tailwindcss/resolveConfig"
import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react"
import classnames from "classnames"

import tailwindConfig from "@/../tailwind.config"
import data from "./data.json"
import { IncrementIcon, DecrementIcon, RemoveItemIcon } from "./icons"

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
  thumbnail: string,
  quantity: number,
}

function App() {
  const [cart, setCart] = useState<CartProduct[]>([])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const cartIsEmpty = cart.length === 0

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
        thumbnail: product.image.thumbnail,
        quantity: 1,
      },
    ])
  }

  const removeItem = (product:CartProduct) => {
    setCart(cart.filter(cartProduct => cartProduct.id !== product.id))
  }

  const decrementQuantity = (product:Product) => {
    const cartProductIndex = cart.findIndex(cartProduct => cartProduct.id === product.id)

    if (cartProductIndex === -1) {
      throw new Error("cart product not found")
    }

    const cartProduct = cart[cartProductIndex]

    const newQuantity = cartProduct.quantity - 1

    if (newQuantity === 0) {
      removeItem(cartProduct)
    } else {
      setCart([
        ...cart.slice(0, cartProductIndex),
        {
          ...cart[cartProductIndex],
          quantity: newQuantity,
        },
        ...cart.slice(cartProductIndex + 1),
      ])
    }
  }

  const incrementQuantity = (product:Product) => {
    const cartProductIndex = cart.findIndex(cartProduct => cartProduct.id === product.id)

    if (cartProductIndex === -1) {
      throw new Error("cart product not found")
    }

    const cartProduct = cart[cartProductIndex]

    const newQuantity = cartProduct.quantity + 1

    setCart([
      ...cart.slice(0, cartProductIndex),
      {
        ...cart[cartProductIndex],
        quantity: newQuantity,
      },
      ...cart.slice(cartProductIndex + 1),
    ])
  }

  const startNewOrder = () => {
    setCart([])
    setConfirmDialogOpen(false)
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
            const cartProduct = cart.find(cartProduct => cartProduct.id === product.id) || null
            const productAddedToCart = cartProduct !== null

            return (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-8">
                    {productAddedToCart && (
                      <div className="absolute inset-0 border-2 border-red-100 rounded-8"></div>
                    )}
                    <picture>
                      <source media={`(min-width:${screens.lg})`} srcSet={product.image.desktop} />
                      <source media={`(min-width:${screens.md})`} srcSet={product.image.tablet} />
                      <img src={product.image.mobile} alt="" />
                    </picture>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-160">
                    <button
                      type="button"
                      className="w-full p-12 flex justify-center border border-rose-400 hover:border-red-100 bg-white rounded-full transition"
                      onClick={() => addItem(product)}
                    >
                      <img src="/assets/images/icon-add-to-cart.svg" alt="" />
                      <span className="ml-8 text-14 font-semibold text-rose-900">Add to Cart</span>
                    </button>
                    {productAddedToCart && (
                      <div className="absolute inset-0 flex items-center bg-red-100 rounded-full">
                        <button type="button" className="h-full px-12 group" onClick={() => decrementQuantity(product)}>
                          <div className="w-20 h-20 flex items-center justify-center border border-white group-hover:bg-white rounded-full transition">
                            <DecrementIcon className="fill-white group-hover:fill-red-100 transition" />
                          </div>
                        </button>
                        <p className="grow text-center text-white">{cartProduct.quantity}</p>
                        <button type="button" className="h-full px-12 group" onClick={() => incrementQuantity(product)}>
                          <div className="w-20 h-20 flex items-center justify-center border border-white group-hover:bg-white rounded-full transition">
                            <IncrementIcon className="fill-white group-hover:fill-red-100 transition" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-38">
                  <p className="text-14 text-rose-500">{product.category}</p>
                  <p className="mt-4 font-semibold text-rose-900">{product.name}</p>
                  <p className="mt-4 font-semibold text-red-100">${product.price.toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-32 shrink-0 lg:w-384 lg:mt-0 lg:px-0">
        <div className="p-24 bg-white rounded-12">
          <p className="text-24 font-bold text-red-100">Your Cart ({cart.length})</p>
          {cartIsEmpty ? (
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
                          <p className="text-14 font-semibold text-red-100">{product.quantity}x</p>
                          <p className="ml-16 text-14 text-rose-500">@{product.price.toFixed(2)}</p>
                          <p className="ml-8 text-14 font-semibold text-rose-500">${totalProductPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="group w-20 h-20 flex items-center justify-center border border-rose-400 hover:border-rose-900 rounded-full transition"
                        onClick={() => removeItem(product)}
                      >
                        <RemoveItemIcon className="fill-rose-300 group-hover:fill-rose-900 transition" />
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
              <button
                type="button"
                className="w-full mt-24 py-16 bg-red-100 hover:bg-red-200 font-semibold text-white rounded-full transition"
                onClick={() => setConfirmDialogOpen(true)}
              >
                Confirm Order
              </button>
            </>
          )}
        </div>
      </div>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} transition>
        <div className="fixed w-screen inset-0 overflow-auto">
          <div className="relative min-h-screen pt-100 flex justify-center items-end md:px-40 md:py-50 md:items-center lg:px-0">
            <TransitionChild>
              <div className="absolute inset-0 bg-black/50 transition data-[closed]:opacity-0"></div>
            </TransitionChild>
            <DialogPanel as={Fragment}>
              <TransitionChild>
                <div className={classnames([
                  "w-full relative z-10 p-24 pt-40 bg-white rounded-t-12 transition md:rounded-b-12 md:p-40 lg:max-w-592",
                  "data-[closed]:translate-y-full md:data-[closed]:translate-y-100 md:data-[closed]:opacity-0",
                ])}>
                  <img src="/assets/images/icon-order-confirmed.svg" alt="" />
                  <p className="mt-24 text-40 leading-tight font-bold text-rose-900">Order Confirmed</p>
                  <p className="mt-8 text-rose-500">We hope you enjoy your food!</p>
                  <div className="mt-32 p-24 bg-rose-50 rounded-8">
                    {cart.map(product => {
                      const totalProductPrice = getTotalProductPrice(product)

                      return (
                        <div key={product.id} className="py-16 first:pt-0 last:pb-0 flex items-center border-t first:border-t-0 border-rose-100">
                          <img src={product.thumbnail} className="w-48 rounded-4" alt="" />
                          <div className="ml-16 grow overflow-hidden">
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis text-14 font-semibold text-rose-900">
                              {product.name}
                            </p>
                            <div className="mt-8 flex items-center">
                              <p className="text-14 font-semibold text-red-100">{product.quantity}x</p>
                              <p className="ml-8 text-14 text-rose-500">@{product.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="ml-8 shrink-0 font-semibold text-rose-900">${totalProductPrice.toFixed(2)}</div>
                        </div>
                      )
                    })}
                    <div className="mt-24 pt-24 flex justify-between items-center border-t border-rose-100">
                      <p className="text-14 text-rose-900">Order Total</p>
                      <p className="text-24 font-bold text-rose-900">${orderTotal.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full mt-32 py-16 bg-red-100 hover:bg-red-200 font-semibold text-white rounded-full transition"
                    onClick={() => startNewOrder()}
                  >
                    Start New Order
                  </button>
                </div>
              </TransitionChild>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default App
