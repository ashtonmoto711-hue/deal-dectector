const { chromium } = require("playwright")
require("dotenv").config()

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto("https://books.toscrape.com")

  const products = await page.locator(".product_pod").all()

  for (const item of products) {
    const product = await item.locator("h3 a").getAttribute("title")
    const priceText = await item.locator(".price_color").textContent()
    const price = Number(priceText.replace("£", ""))

    const existing = await supabase
      .from("Deals")
      .select("id")
      .eq("Name", product)
      .limit(1)

    if (existing.data && existing.data.length > 0) {
      console.log("Skipping duplicate:", product)
      continue
    }

    const randomId = Date.now() + Math.floor(Math.random() * 100000)

    const { error } = await supabase.from("Deals").insert({
      id: randomId,
      Name: product,
      Store: "BooksToScrape",
      Location: "Website",
      ZipCode: "00000",
      Old_Price: 100,
      New_Price: price,
    })

    if (error) {
      console.log("Save error:", error)
      continue
    }

    console.log("Saved:", product)
  }

  await browser.close()
}

run()