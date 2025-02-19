export const wrappingCost = (price, countProduct, priceDiscount = 0) => {
  const wrapping = [
    { price: 1000, percent: [25, 20, 15, 10, 5, 0] },
    { price: 2000, percent: [20, 18, 16, 14, 10, 0] },
    { price: 3000, percent: [10, 10, 10, 9, 8, 0] },
    { price: 4000, percent: [9, 9, 9, 8, 7, 0] },
    { price: 5000, percent: [7, 7, 7, 6, 5, 0] },
    { price: 6000, percent: [6, 6, 6, 5, 4, 0] },
    { price: 8000, percent: [5, 5, 5, 4, 3, 0] },
    { price: 10000, percent: [4, 4, 4, 3, 2, 0] },
    { price: 20000, percent: [3, 3, 3, 2, 1, 0] },
    { price: 30000, percent: [2, 2, 2, 2, 1, 0] },
    { price: 40000, percent: [1.5, 1.5, 1.5, 1.5, 1, 0] },
    { price: 70000, percent: [1, 1, 1, 1, 1, 0] },
    { overPrice: 80000, percent: [0, 0, 0, 0, 0, 0] },
  ]

  const editCost = (cost, count, discount) => {
    let newPrice = 0
    for (let item of wrapping) {
      if (cost < item['price']) {
        newPrice = Math.round(cost + (cost / 100) * item['percent'][discount])
        break
      } else if (cost > item['overPrice']) {
        newPrice = cost
        break
      }
    }
    newPrice = newPrice * count
    return Number(newPrice)
  }
  return editCost(price, countProduct, priceDiscount)
}
