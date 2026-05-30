"use client"

import { useEffect,useState } from "react"

import { supabase }
from "../lib/supabase"

export default function Home(){

const [deals,setDeals] =
useState<any[]>([])

const [loading,setLoading] =
useState(false)

async function loadDeals(){

const { data } =

await supabase

.from("Deals")

.select("*")

.order(
"id",
{ascending:false}
)

if(data){

setDeals(data)

}

}

useEffect(()=>{

loadDeals()

},[])

async function runScraper(){

setLoading(true)

await fetch(

"/api/scrape"

)

await loadDeals()

setLoading(false)

}

return(

<div className="p-10 max-w-xl mx-auto">

<h1 className="text-5xl font-bold">

Deal Detective

</h1>

<p className="mt-4">

Find Hidden Clearance Deals

</p>

<button

className="bg-green-600 p-4 mt-6"

onClick={runScraper}

>

{

loading

?

"Running..."

:

"Run Scraper"

}

</button>

<div className="mt-8">

{

deals.map(

(deal:any)=>{

const discount =
Math.round(

(

(deal.Old_Price -

deal.New_Price)

/

deal.Old_Price

)

*100

)

return(

<div

key={deal.id}

className="border p-5 mt-4"

>

<h2 className="font-bold">

{deal.Name}

</h2>

<p>

Store:

{deal.Store}

</p>

<p>

Now:

$

{deal.New_Price}

</p>

<p>

Discount:

{discount}% OFF

</p>

</div>

)

}

)

}

</div>

</div>

)

}