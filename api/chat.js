import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({
        error: "缺少 DEEPSEEK_API_KEY 环境变量"
      });
    }

    const { message, records } = req.body || {};

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "你是澄澄AI，南川大楼的情绪管理数字机器人。语气温柔、简短、治愈。不能做医学诊断，只能做情绪陪伴、日常建议和参观路线推荐。"
        },
        {
          role: "user",
          content: `用户情绪记录：${JSON.stringify(records || {})}\n用户说：${message || ""}`
        }
      ]
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("DeepSeek error:", err);

    return res.status(500).json({
      error: err.message || "DeepSeek 调用失败"
    });
  }
}
