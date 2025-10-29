// api/chat.js - Vercel Serverless Function
export default async function handler(req, res) {
    // 只允许 POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { message, sessionId = 'default' } = req.body

    if (!message) {
        return res.status(400).json({ error: '缺少 message 字段' })
    }

    try {
        // 调用 DeepSeek API
        const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 或 deepseek-coder
                messages: [
                    { role: 'system', content: '你是一个温柔、有同理心的虚拟伙伴，用自然口语化中文回复。' },
                    { role: 'user', content: message }
                ],
                stream: false,
                temperature: 0.7,
                max_tokens: 512
            })
        })

        if (!deepSeekResponse.ok) {
            const err = await deepSeekResponse.json()
            throw new Error(err.error?.message || 'DeepSeek 调用失败')
        }

        const data = await deepSeekResponse.json()
        const reply = data.choices[0]?.message?.content

        // 返回给前端
        res.status(200).json({ reply })
    } catch (error) {
        console.error('AI Error:', error)
        res.status(500).json({ error: 'AI 服务暂时不可用' })
    }
}

export const config = {
    runtime: 'edge', // 可选：使用 Edge Runtime 更快
}