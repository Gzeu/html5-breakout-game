// Vercel Serverless Function for Groq AI Integration
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { gameState, difficulty = 'medium' } = req.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `You are an advanced AI player for a Breakout game. Based on the current game state, provide the optimal paddle position and strategy.

Game State:
- Ball position: (${gameState.ball.x}, ${gameState.ball.y})
- Ball velocity: (${gameState.ball.dx}, ${gameState.ball.dy})
- Paddle position: (${gameState.paddle.x}, ${gameState.paddle.y})
- Paddle width: ${gameState.paddle.width}
- Canvas size: ${gameState.canvas.width} x ${gameState.canvas.height}
- Score: ${gameState.score}
- Lives: ${gameState.lives}
- Bricks remaining: ${gameState.bricksRemaining}
- Power-ups: ${JSON.stringify(gameState.powerUps)}

Difficulty: ${difficulty}

Provide a JSON response with:
{
  "paddleX": <optimal_x_position>,
  "strategy": "<brief_strategy_explanation>",
  "confidence": <0-100_confidence_score>,
  "reasoning": "<detailed_reasoning>"
}

Consider ball trajectory prediction, power-up collection, defensive positioning, and strategic brick targeting.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a master Breakout game player AI. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // Fallback to basic strategy if JSON parsing fails
      parsedResponse = {
        paddleX: gameState.ball.x - (gameState.paddle.width / 2),
        strategy: 'Follow ball center',
        confidence: 75,
        reasoning: 'Basic ball tracking strategy'
      };
    }

    // Ensure paddleX is within bounds
    parsedResponse.paddleX = Math.max(
      0,
      Math.min(
        gameState.canvas.width - gameState.paddle.width,
        parsedResponse.paddleX
      )
    );

    return res.status(200).json({
      success: true,
      aiDecision: parsedResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Groq AI Error:', error);
    return res.status(500).json({
      error: 'AI processing failed',
      message: error.message
    });
  }
}