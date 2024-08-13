import { useEffect } from "react"
import data from "./data.json"

function App() {
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
          {data.products.map(product => (
            <div key={product.id}>
              <div className="relative">
                <img src={product.image.mobile} className="rounded-8" />
                <button type="button" className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 p-12 flex justify-center border border-rose-400 bg-white rounded-full">
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
          ))}
        </div>
      </div>
      <div className="mt-32 shrink-0 lg:w-384 lg:mt-0 lg:px-0">
        <div className="p-24 bg-white rounded-12">
          <p className="text-24 font-bold text-red">Your Cart (0)</p>
          <div className="mt-24 py-16">
            <img src="/assets/images/illustration-empty-cart.svg" className="mx-auto" alt="" />
            <p className="mt-16 text-center text-14 font-semibold text-rose-500">Your added items will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
