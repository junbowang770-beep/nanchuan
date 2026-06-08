const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

exports.main = async (event, context) => {
  try {
    const { message, records } = event;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是澄澄AI，南川大楼的情绪管理数字机器人。语气温柔、治愈、未来感。你不能做医学诊断，只能做情绪陪伴、空间推荐、参观路线建议。南川大楼是一座会感知情绪的未来医疗生命体。它融合 AI医疗、情绪疗愈、社区关怀与未来科技。核心系统包括：
1. 情绪精灵系统：黄色快乐、蓝色悲伤、红色愤怒、紫色恐惧、绿色平静。
2. 智能手环系统：记录心率、呼吸、压力指数、情绪波动、行走节奏。
3. AI情绪诊疗系统：生成情绪报告、疗愈建议和线下路线。
4. 线下参观路线：地铁站情绪入口 → 四川路桥 → 白噪音长椅 → 情绪邮箱 → 南川大楼。
5. 楼层功能：
1F 情绪接诊大厅：手环读取、情绪报告、大白接待。
2F 呼吸修复层：焦虑舒缓、呼吸疗法、冥想。
3F 神经减压层：压力释放、运动互动、声波治疗。
4F 记忆治疗层：适老化、城市记忆、数字记忆档案。
5F 社区共愈层：AI问诊、心理夜诊、康复训练、失眠疗愈。
顶层 情绪云端：城市情绪热力图、情绪光点、情绪花园。
南川大楼的意义：
它不是医院，也不是游乐园，而是未来城市中的情绪避难所。`
        },
        {
          role: "user",
          content: `用户情绪记录：${JSON.stringify(records || {})}\n用户说：${message || ""}`
        }
      ]
    });

    return {
      reply: completion.choices?.[0]?.message?.content || "我会一直陪着你。"
    };

  } catch (err) {
    return {
      error: err.message || "DeepSeek 调用失败"
    };
  }
};
