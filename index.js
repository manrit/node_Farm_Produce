const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const data = fs.readFileSync(`./starter/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `./starter/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `./starter/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `./starter/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });

    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text.html",
      "My-own-Header": " Hello World",
    });
    res.end();
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Hey, server is listening to requests on port 8000");
});
