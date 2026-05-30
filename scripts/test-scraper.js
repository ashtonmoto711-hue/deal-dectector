const { chromium } = require("playwright")

require("dotenv").config({ path: ".env.local" })

const { createClient } =
require("@supabase/supabase-js")

const supabase =
createClient(

process.env.NEXT_PUBLIC_SUPABASE_URL,

process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

)

async function run(){

const browser =
await chromium.launch({

headless:false

})

const page =
await browser.newPage()

for(

let pageNumber=1;

pageNumber<=5;

pageNumber++

){

const url =

pageNumber===1

?

"https://books.toscrape.com"

:

`https://books.toscrape.com/catalogue/page-${pageNumber}.html`

await page.goto(url)

const products =
await page
.locator(".product_pod")
.all()

for(

const item

of products

){

const product =
await item
.locator("h3 a")
.getAttribute(
"title"
)

const priceText =
await item
.locator(".price_color")
.textContent()

const price =
Number(

priceText
.replace("£","")

)

const existing =
await supabase

.from("Deals")

.select("id")

.eq(
"Name",
product
)

.limit(1)

if(

existing.data &&
existing.data.length>0

){

console.log(

"Skipping Duplicate:",

product

)

continue

}

const randomId =

Date.now()

+

Math.floor(

Math.random()*100000

)

await supabase

.from("Deals")

.insert({

id:randomId,

Name:product,

Store:"BooksToScrape",

Location:"Website",

ZipCode:"00000",

Old_Price:100,

New_Price:price

})

console.log(

"Saved:",

product

)

}

}

await browser.close()

}

run()