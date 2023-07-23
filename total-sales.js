import level from 'level'
import sublevel from 'subleveldown'

const db = level('example-db')
const salesDb = sublevel(db, 'sales', { valueEncoding: 'json' })

export async function totalSales (product, cb) {
  const now = Date.now()
  let sum = 0
  const stream = salesDb.createValueStream();
  stream.on('data', (transaction) => {
    if (!product || transaction.product === product) {
        sum += transaction.amount
      }
  })
  
  stream.on('end', () => {
    console.log(`totalSales() took: ${Date.now() - now}ms`)
    cb(null, sum);
  })

  stream.on('error', err => {
    cb(err);
  })
}
