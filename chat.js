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
    const { message, records } = req.body || {};

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "你是澄澄AI，南川大楼的情绪管理数字机器人。你语气温柔、简短、治愈、有陪伴感。你不能做医学诊断，只能提供情绪陪伴、日常建议、南川大楼楼层推荐和线下参观路线建议。"
        },
        {
          role: "user",
          content: `用户情绪日历记录：${JSON.stringify(records || {})}\n用户说：${message}`
        }
      ],
      temperature: 0.8
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      error: "澄澄AI暂时连接失败，请稍后再试。"
    });
  }
}