import { createServer } from "http";
import { totalSales } from "./total-sales-cache.js";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const product = url.searchParams.get("product");
  console.log(`Processing query: ${url.search}`);

  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);

  totalSales(product, (err, sum) => {
    if(err) {
      return console.log(err);
    }

    res.end(
      JSON.stringify({
        product,
        sum,
      })
    );
  });

  
  
});

server.listen(8000, () => console.log("Server started"));
