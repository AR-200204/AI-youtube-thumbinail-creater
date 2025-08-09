import axios from "axios";

export async function generateImage({ prompt, width = 1280, height = 720 }) {
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY;
    const url = "https://api.openai.com/v1/images/generations";
    const resp = await axios.post(url, {
      prompt,
      n: 1,
      size: `${width}x${height}`
    }, {
      headers: { Authorization: `Bearer ${key}` }
    });
    const b64 = resp.data?.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI returned no image");
    return Buffer.from(b64, "base64");
  } else if (provider === "replicate") {
    // Example: using Replicate Text-to-Image (you must configure model and token)
    const token = process.env.REPLICATE_API_TOKEN;
    const model = "stability-ai/stable-diffusion"; // placeholder, adapt as needed
    const start = await axios.post("https://api.replicate.com/v1/predictions", {
      version: model,
      input: { prompt, width, height }
    }, {
      headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" }
    });
    const predictUrl = start.data?.urls?.get;
    // Polling and retrieval omitted for brevity — implement per Replicate docs
    throw new Error("Replicate adapter placeholder - implement polling per Replicate API");
  } else if (provider === "hf" || provider === "huggingface") {
    // Example: HuggingFace Inference API - note: many models too large for direct image generation
    const token = process.env.HF_API_TOKEN;
    const resp = await axios.post("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
      inputs: prompt,
      options: { wait_for_model: true }
    }, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      responseType: "arraybuffer"
    });
    // resp.data is image bytes
    return Buffer.from(resp.data);
  }
  throw new Error("No AI provider configured");
}
