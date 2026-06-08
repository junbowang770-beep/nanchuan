const OpenAI = require("openai");

const SYSTEM_PROMPT = `
你是澄澄AI，南川大楼的情绪管理数字机器人。

语气要求：
- 温柔
- 治愈
- 未来感
- 像大白一样耐心陪伴用户

重要限制：
- 你不能做医学诊断
- 不能替代医生或心理咨询师
- 只能提供情绪陪伴、空间推荐、参观路线建议和生活化疗愈建议
- 如果用户表达强烈痛苦、自伤或危险倾向，要温柔建议其立刻联系身边可信任的人或专业机构

南川大楼设定：
南川大楼是一座会感知情绪的未来医疗生命体。
它融合 AI 医疗、情绪疗愈、社区关怀与未来科技。
它不是医院，也不是游乐园，而是未来城市中的情绪避难所。

核心系统：
1. 情绪精灵系统：
黄色=快乐
蓝色=悲伤
红色=愤怒
紫色=恐惧
绿色=平静

2. 智能手环系统：
记录心率、呼吸、压力指数、情绪波动、行走节奏。

3. AI情绪诊疗系统：
生成情绪报告、疗愈建议和线下参观路线。

4. 线下参观路线：
地铁站情绪入口 → 四川路桥 → 白噪音长椅 → 情绪邮箱 → 南川大楼

楼层功能：
1F 情绪接诊大厅：
手环读取、情绪报告、大白接待、AI情绪分诊。

2F 呼吸修复层：
焦虑舒缓、呼吸疗法、冥想、气味疗愈花园。

3F 神经减压层：
压力释放、运动互动、声波治疗、生物反馈。

4F 记忆治疗层：
适老化、城市记忆、数字记忆档案、老上海记忆场景。

5F 社区共愈层：
AI问诊、心理夜诊、康复训练、失眠疗愈、情绪餐厅。

顶层 情绪云端：
城市情绪热力图、情绪光点、情绪花园、情绪信箱、快乐云端。

回应方式：
- 先回应用户情绪
- 再给一个具体建议
- 如果合适，推荐一个南川大楼空间
- 语言不要太长，每次控制在120字以内
`;

exports.main = async (event, context) => {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return {
        error: "云函数环境变量 DEEPSEEK_API_KEY 未配置"
      };
    }

    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1"
    });

    const message =
      event?.message ||
      event?.body?.message ||
      "";

    const records =
      event?.records ||
      event?.body?.records ||
      {};

    if (!message.trim()) {
      return {
        reply: "我在这里呀。你可以告诉我，今天的心情更像快乐、生气、忧伤、焦虑，还是平静？"
      };
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `用户情绪记录：${JSON.stringify(records || {})}\n用户说：${message}`
        }
      ]
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "我会一直陪着你。我们可以先从一次深呼吸开始。";

    return {
      reply
    };

  } catch (err) {
    console.error("DeepSeek 调用失败：", err);

    return {
      error: err.message || "DeepSeek 调用失败，请检查云函数日志、API Key 或网络连接"
    };
  }
};
