// Vercel Serverless Function for Enhanced Groq AI Integration with Personalities
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
    const { 
      gameState, 
      difficulty = 'medium', 
      personality = 'balanced',
      personalityPrompt = null
    } = req.body;
    
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Define personality-specific behaviors and prompts
    const personalities = {
      'aggressive': {
        name: 'Aggressive',
        systemPrompt: 'You are an aggressive AI player who takes high-risk, high-reward positions. Move quickly to intercept balls and prioritize offensive play over safety.',
        temperatureModifier: 0.9,
        strategyBias: 'Take calculated risks to maximize ball control and score opportunities.'
      },
      'defensive': {
        name: 'Defensive',
        systemPrompt: 'You are a defensive AI player who focuses on safe positioning and ball control. Minimize risk of missing the ball and prioritize defensive play.',
        temperatureModifier: 0.3,
        strategyBias: 'Maintain safe positioning and avoid risky moves that could result in losing the ball.'
      },
      'predictive': {
        name: 'Predictive',
        systemPrompt: 'You are a predictive AI player who uses advanced calculations and perfect trajectory prediction. Anticipate ball movement with mathematical precision.',
        temperatureModifier: 0.5,
        strategyBias: 'Use advanced trajectory calculations and predict future ball positions accurately.'
      },
      'adaptive': {
        name: 'Adaptive',
        systemPrompt: 'You are an adaptive AI player who switches strategies based on current game situation. Adapt behavior dynamically to changing game conditions.',
        temperatureModifier: 0.7,
        strategyBias: 'Analyze current game state and adapt strategy accordingly. Switch between aggressive and defensive play based on context.'
      },
      'balanced': {
        name: 'Balanced',
        systemPrompt: 'You are a balanced AI player who maintains well-rounded gameplay with moderate risk-taking and strategic positioning.',
        temperatureModifier: 0.6,
        strategyBias: 'Maintain balanced gameplay with moderate risk-taking and strategic positioning.'
      }
    };

    // Get personality configuration or default to balanced
    const currentPersonality = personalities[personality] || personalities['balanced'];
    
    // Use custom personality prompt if provided, otherwise use predefined one
    const personalityInstruction = personalityPrompt || currentPersonality.strategyBias;

    // Build dynamic difficulty adjustments
    const difficultyModifiers = {
      'easy': {
        responseSpeed: 'Take more time to decide, don\'t rush decisions.',
        accuracy: 'Aim for the general area, perfect precision not required.'
      },
      'medium': {
        responseSpeed: 'Balance speed and accuracy in decisions.',
        accuracy: 'Aim for good positioning with reasonable precision.'
      },
      'hard': {
        responseSpeed: 'Make quick, decisive moves.',
        accuracy: 'Precise positioning and optimal ball control required.'
      },
      'expert': {
        responseSpeed: 'Instantaneous optimal decisions required.',
        accuracy: 'Perfect positioning and maximum efficiency.'
      }
    };

    const difficultyConfig = difficultyModifiers[difficulty] || difficultyModifiers['medium'];

    // Analyze game state for adaptive personality
    let adaptiveContext = '';
    if (personality === 'adaptive') {
      const scoreRatio = gameState.score / Math.max(1, 1000); // Normalize score
      const livesRatio = gameState.lives / 3; // Assume 3 starting lives
      const bricksRatio = gameState.bricksRemaining / Math.max(1, 50); // Assume ~50 starting bricks
      
      if (livesRatio <= 0.33) {
        adaptiveContext = 'CRITICAL: Very low lives remaining - prioritize defensive play and safety.';
      } else if (scoreRatio > 2.0) {
        adaptiveContext = 'HIGH SCORE: Excellent performance - can take moderate risks for bonus points.';
      } else if (bricksRatio < 0.2) {
        adaptiveContext = 'FINAL STAGE: Few bricks left - focus on precision and completion.';
      } else {
        adaptiveContext = 'NORMAL: Balanced gameplay appropriate for current state.';
      }
    }

    const prompt = `You are ${currentPersonality.name.toLowerCase()} AI playing Breakout. ${currentPersonality.systemPrompt}

Personality Instructions: ${personalityInstruction}

${adaptiveContext ? `Adaptive Context: ${adaptiveContext}\n` : ''}Difficulty Level: ${difficulty}
- ${difficultyConfig.responseSpeed}
- ${difficultyConfig.accuracy}

Current Game State:
- Ball position: (${gameState.ball.x}, ${gameState.ball.y})
- Ball velocity: (${gameState.ball.dx}, ${gameState.ball.dy})
- Ball speed: ${Math.sqrt(gameState.ball.dx * gameState.ball.dx + gameState.ball.dy * gameState.ball.dy).toFixed(2)}
- Paddle position: (${gameState.paddle.x}, ${gameState.paddle.y})
- Paddle width: ${gameState.paddle.width}
- Canvas dimensions: ${gameState.canvas.width} x ${gameState.canvas.height}
- Current score: ${gameState.score}
- Lives remaining: ${gameState.lives}
- Bricks remaining: ${gameState.bricksRemaining}
- Active power-ups: ${JSON.stringify(gameState.powerUps || [])}

Calculate the optimal paddle position based on your ${personality} personality.

Respond with ONLY valid JSON in this exact format:
{
  "paddleX": <optimal_x_position_number>,
  "strategy": "<brief_strategy_name>",
  "confidence": <confidence_0_to_100>,
  "reasoning": "[${currentPersonality.name}] <detailed_explanation>"
}`;

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
            content: `You are a ${currentPersonality.name} Breakout game AI. Always respond with valid JSON only. ${currentPersonality.systemPrompt}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: currentPersonality.temperatureModifier,
        max_tokens: 400,
        top_p: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Parse JSON response with enhanced error handling
    let parsedResponse;
    try {
      // Try to extract JSON from response if it's wrapped in other text
      const jsonMatch = aiResponse.match(/\{[^}]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.warn('JSON parsing failed, using personality-based fallback:', parseError);
      // Personality-specific fallback responses
      parsedResponse = getPersonalityFallback(gameState, personality, currentPersonality);
    }

    // Validate and sanitize response
    if (!parsedResponse || typeof parsedResponse.paddleX !== 'number') {
      parsedResponse = getPersonalityFallback(gameState, personality, currentPersonality);
    }

    // Ensure paddleX is within bounds
    parsedResponse.paddleX = Math.max(
      0,
      Math.min(
        gameState.canvas.width - gameState.paddle.width,
        parsedResponse.paddleX
      )
    );

    // Add personality metadata to response
    parsedResponse.personality = personality;
    parsedResponse.personalityName = currentPersonality.name;

    return res.status(200).json({
      success: true,
      aiDecision: parsedResponse,
      personality: {
        current: personality,
        name: currentPersonality.name,
        temperature: currentPersonality.temperatureModifier
      },
      difficulty: difficulty,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Enhanced Groq AI Error:', error);
    
    // Enhanced error fallback with personality consideration
    const { gameState, personality = 'balanced' } = req.body;
    const personalities = {
      'aggressive': { name: 'Aggressive' },
      'defensive': { name: 'Defensive' },
      'predictive': { name: 'Predictive' },
      'adaptive': { name: 'Adaptive' },
      'balanced': { name: 'Balanced' }
    };
    
    const currentPersonality = personalities[personality] || personalities['balanced'];
    const fallbackResponse = getPersonalityFallback(gameState, personality, currentPersonality);
    
    return res.status(500).json({
      error: 'AI processing failed',
      message: error.message,
      fallbackDecision: fallbackResponse,
      personality: {
        current: personality,
        name: currentPersonality.name
      }
    });
  }
}

// Personality-specific fallback logic
function getPersonalityFallback(gameState, personality, personalityConfig) {
  const ball = gameState.ball;
  const paddle = gameState.paddle;
  const canvas = gameState.canvas;
  
  let targetX;
  let strategy;
  let confidence;
  let reasoning;
  
  switch (personality) {
    case 'aggressive':
      // Aggressive: Intercept ball with anticipation
      const aggressiveOffset = ball.dx * 3; // Anticipate ball movement
      targetX = ball.x + aggressiveOffset - paddle.width / 2;
      strategy = 'AGGRESSIVE_INTERCEPT';
      confidence = 85;
      reasoning = '[Aggressive] Taking aggressive position with high-risk interception';
      break;
      
    case 'defensive':
      // Defensive: Safe center positioning with minimal ball influence
      const centerX = canvas.width / 2 - paddle.width / 2;
      const defensiveInfluence = (ball.x - canvas.width / 2) * 0.3;
      targetX = centerX + defensiveInfluence;
      strategy = 'DEFENSIVE_CENTER';
      confidence = 90;
      reasoning = '[Defensive] Maintaining safe center position with minimal risk';
      break;
      
    case 'predictive':
      // Predictive: Calculate trajectory intersection
      let predictedX = ball.x;
      let tempDx = ball.dx;
      
      // Simulate ball movement for several frames
      for (let i = 0; i < 20; i++) {
        predictedX += tempDx;
        if (predictedX <= 0 || predictedX >= canvas.width) {
          tempDx = -tempDx;
        }
      }
      
      targetX = predictedX - paddle.width / 2;
      strategy = 'PREDICTIVE_TRAJECTORY';
      confidence = 88;
      reasoning = '[Predictive] Using advanced trajectory calculation for optimal positioning';
      break;
      
    case 'adaptive':
      // Adaptive: Choose strategy based on game state
      const score = gameState.score || 0;
      const lives = gameState.lives || 3;
      
      if (lives <= 1) {
        // Be defensive when low on lives
        targetX = canvas.width / 2 - paddle.width / 2 + (ball.x - canvas.width / 2) * 0.2;
        strategy = 'ADAPTIVE_DEFENSIVE';
        reasoning = '[Adaptive] Low lives - switching to defensive strategy';
      } else if (score > 1000) {
        // Be aggressive when score is high
        targetX = ball.x + ball.dx * 2 - paddle.width / 2;
        strategy = 'ADAPTIVE_AGGRESSIVE';
        reasoning = '[Adaptive] High score - switching to aggressive strategy';
      } else {
        // Balanced approach
        targetX = ball.x - paddle.width / 2;
        strategy = 'ADAPTIVE_BALANCED';
        reasoning = '[Adaptive] Normal conditions - using balanced approach';
      }
      confidence = 82;
      break;
      
    default: // balanced
      // Balanced: Standard ball tracking with moderate anticipation
      const balancedOffset = ball.dx * 1.5;
      targetX = ball.x + balancedOffset - paddle.width / 2;
      strategy = 'BALANCED_TRACKING';
      confidence = 80;
      reasoning = '[Balanced] Standard ball tracking with moderate anticipation';
      break;
  }
  
  // Clamp to bounds
  targetX = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
  
  return {
    paddleX: targetX,
    strategy: strategy,
    confidence: confidence,
    reasoning: reasoning,
    personality: personality,
    personalityName: personalityConfig.name,
    fallback: true
  };
}