import { totalSales as totalSalesRaw } from "./total-sales.js";

const cache = new Map()

export const totalSales = (product, cb)  => {
    let cachedProduct;
    if(cache.has(product)) {
        cachedProduct = cache.get(product);
        if(cachedProduct.value) {
            return process.nextTick(() => cb(null, cachedProduct.value));
        }

        return cachedProduct.waiting.push(cb);
    }

    cachedProduct = {
        waiting: [cb],
        value: null
    }

    cache.set(product, cachedProduct);
    totalSalesRaw(product, (err, sum) => {
        cachedProduct = cache.get(product);
        if(err) {
            cachedProduct.waiting.forEach(cb => cb(err));
            return cache.delete(product);
        }
        
        cachedProduct.value = sum;
        cachedProduct.waiting.forEach(cb => cb(null, sum));
        cachedProduct.waiting = [];
    })
}