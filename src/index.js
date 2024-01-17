export default {
	async fetch(request, env, ctx) {
		if(request.method=="POST"){
			const reqJson=JSON.parse(decodeURIComponent(await request.text()));
			for(let i=0;i<=Object.keys(reqJson).length;i++){
				await env.STORE_KV.put(Object.keys(reqJson)[i],JSON.stringify(Object.values(reqJson)[i]));
			}
			return new Response("Successfully sent data.");
		}else if(request.method=="GET"){
			const reqKey=new URL(await request.url).searchParams.get("key"),resJson=await env.STORE_KV.get(reqKey);
			if(resJson==null){
				return new Response("Data not found!",{status:404,statusText:"Not Found"});
			}else{
				return new Response(resJson,{headers:new Headers({"Content-Type":"application/json","Access-Control-Allow-Origin":"*"})});
			}
		}
	},
};