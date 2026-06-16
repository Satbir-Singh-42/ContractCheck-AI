import { legalKnowledgeBase, LegalSection } from './legal-knowledge-base.ts';

export function retrieveRelevantSections(contractText: string, maxResults: number = 8): LegalSection[] {
  // Simple tokenization and keyword matching
  
  const scoredSections = legalKnowledgeBase.map(section => {
    let score = 0;
    section.keywords.forEach(kw => {
      // Basic count of keyword occurrences
      const kwLower = kw.toLowerCase();
      // Using split is a fast way to count occurrences without heavy regex
      const occurrences = contractText.toLowerCase().split(kwLower).length - 1;
      
      if (occurrences > 0) {
        // Logarithmic weighting to avoid a single repeated word dominating the score
        score += 1 + Math.log(occurrences);
      }
    });
    return { section, score };
  });

  // Sort descending by score
  scoredSections.sort((a, b) => b.score - a.score);

  // Return the top N sections that have at least some relevance
  return scoredSections
    .filter(s => s.score > 0)
    .slice(0, maxResults)
    .map(s => s.section);
}
