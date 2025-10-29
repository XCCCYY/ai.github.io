// api/chat.js
require('dotenv').config()

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { message } = req.body

    if (!message) {
        return res.status(400).json({ error: '缺少 message 字段' })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
        console.error('API Key 未配置')
        return res.status(500).json({ error: 'API Key 未配置' })
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一个温柔、有同理心的AI伙伴。' },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 512
            })
        })

        if (!response.ok) {
            const err = await response.json()
            console.error('DeepSeek Error:', err)
            return res.status(500).json({ error: 'AI 服务暂时不可用' })
        }

        const data = await response.json()
        const reply = data.choices[0]?.message?.content

        res.json({ reply })
    } catch (error) {
        console.error('Request failed:', error)
        res.status(500).json({ error: 'AI 服务暂时不可用' })
    }
}