import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generatePropertyDescription(propertyDetails: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const result = await model.generateContent(
    `Generate a compelling property description for the following details: ${propertyDetails}`
  )

  const response = await result.response
  return response.text()
}

export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: 'embedding-001' })
  const result = await model.embedContent(text)
  const embedding = result.embedding

  // Check if the embedding has 1536 dimensions
  if (embedding.values.length !== 1536) {
    // If not, we need to pad or truncate the embedding to 1536 dimensions
    const paddedEmbedding = new Array(1536).fill(0);
    for (let i = 0; i < Math.min(embedding.values.length, 1536); i++) {
      paddedEmbedding[i] = embedding.values[i];
    }
    return paddedEmbedding;
  }

  return embedding.values
}

export async function performSimilaritySearch(query: string, embeddings: number[][]) {
  try {
    const queryEmbedding = await generateEmbedding(query)

    // Compute cosine similarity
    const similarities = embeddings.map(embedding => {
      const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * embedding[i], 0)
      const magnitude1 = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0))
      const magnitude2 = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      return dotProduct / (magnitude1 * magnitude2)
    })

    return similarities
  } catch (error) {
    console.error('Error in performSimilaritySearch:', error)
    throw new Error('Failed to perform similarity search')
  }
}

