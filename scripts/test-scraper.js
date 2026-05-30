import "dotenv/config"

import { createClient } from "@supabase/supabase-js"
import { chromium } from "playwright"
import WebSocket from "ws"

const supabase = createClient(

process.env.NEXT_PUBLIC_SUPABASE_URL,

process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

{
 realtime:{
 transport: WebSocket
 }
}

)

async function run(){

const browser = await chromium.launch({

headless:true

})

const page = await browser.newPage()

await page.goto(

"https://books.toscrape.com"

)

const products = await page

.locator(".product_pod")

.all()

for(const item of products){

const product = await item

.locator("h3 a")

.getAttribute("title")

const priceText = await item

.locator(".price_color")

.first()

.textContent()

const price = Number(

priceText.replace("£","")

)

const { error } = await supabase

.from("Deals")

.insert({

Name:product,

Store:"BooksToScrape",

Location:"Website",

ZipCode:"00000",

Old_Price:100,

New_Price:price

})

if(!error){

await fetch(

process.env.DISCORD_WEBHOOK_URL,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

content:

`🔥 NEW DEAL FOUND:

${product}

Price: £${price}`

})

}

)

}

}

await browser.close()

}

run()