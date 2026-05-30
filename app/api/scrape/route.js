export async function GET(){

await fetch(process.env.DISCORD_WEBHOOK_URL,{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({
    content:"✅ Discord test from Deal Detective"
  })
})

return Response.json({
  success:true
})

}