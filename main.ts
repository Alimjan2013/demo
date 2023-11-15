import OpenAI from "npm:openai";
const openai = new OpenAI();
async function main(model,context,question) {
  const completion = await openai.chat.completions.create({
    // messages: [{ role: "system", content: question }],
    model: model,
    messages: [{ role: "user", content: context }],
    messages: [{ role: "user", content: question }],
    
  });

  console.log(completion);
  return completion.choices[0].message.content
}

const kv = await Deno.openKv();


Deno.serve(async (req) => {

  if (req.body) {
    
    const body = await req.json();
    console.log("Body:", body);
    
    const result = await main(body.model,body.context,body.question);
    
    console.log(result);
    const jsonResult = JSON.stringify({result:result});
    const prefs = {
      model:body.model,
      context:body.context,
      question:body.question,
      answer:result
    }
    const resultFromKV = await kv.set(["log", "alimjan",Date.now(), crypto.randomUUID()], [prefs,body.model]);

    return new Response(jsonResult, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  }

   return new Response("Hello, World!");
});
