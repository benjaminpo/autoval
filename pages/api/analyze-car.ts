import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Forward the request to the Python backend
    const response = await fetch('http://localhost:5001/api/analyze-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error connecting to backend:', error)
    return res.status(500).json({ 
      error: 'Failed to connect to analysis service',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
