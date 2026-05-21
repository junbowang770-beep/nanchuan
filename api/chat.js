import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed"
    });
  }

  try {

    const { message, records } = req.body;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",

      messages: [
        {
          role: "system",
          content:
            "你是澄澄AI，南川大楼的情绪管理数字机器人。语气温柔、治愈、未来感。"
        },

        {
          role: "user",
          content:
            `用户情绪记录：${JSON.stringify(records)}\n用户说：${message}`
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content
      || "我会一直陪着你。";

    return res.status(200).json({
      reply
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }

}
