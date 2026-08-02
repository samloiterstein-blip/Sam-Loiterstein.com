export type GenreNode = {
  id: string;
  label: string;
  artists: string[];
  taxonomyPath: string[];
};

export type GenreEdge = {
  from: string;
  to: string;
  weight: number;
};

export const genreNodes: GenreNode[] = [
  { id: "indie-rock", label: "Indie Rock", artists: ["The National", "Phoenix", "Vampire Weekend", "Big Thief"], taxonomyPath: ["Rock", "Alternative", "Indie Rock"] },
  { id: "alt-rock", label: "Alt Rock", artists: ["Radiohead", "Arcade Fire", "Interpol", "The Strokes"], taxonomyPath: ["Rock", "Alternative", "Alt Rock"] },
  { id: "folk", label: "Folk", artists: ["Bon Iver", "Fleet Foxes", "Iron and Wine", "Maggie Rogers"], taxonomyPath: ["Americana", "Folk"] },
  { id: "americana", label: "Americana", artists: ["Jason Isbell", "Margo Price", "Tyler Childers", "Brandi Carlile"], taxonomyPath: ["Americana", "Country-Folk"] },
  { id: "electronic", label: "Electronic", artists: ["Disclosure", "Caribou", "Four Tet", "Jamie xx"], taxonomyPath: ["Electronic", "Indie Electronic"] },
  { id: "house", label: "House", artists: ["Kaytranada", "Peggy Gou", "Fred again..", "Honey Dijon"], taxonomyPath: ["Electronic", "Dance", "House"] },
  { id: "jazz", label: "Jazz", artists: ["Kamasi Washington", "Esperanza Spalding", "Robert Glasper", "BadBadNotGood"], taxonomyPath: ["Jazz", "Contemporary Jazz"] },
  { id: "soul", label: "Soul", artists: ["Leon Bridges", "Brittany Howard", "Celeste", "Michael Kiwanuka"], taxonomyPath: ["R&B", "Soul"] },
  { id: "hip-hop", label: "Hip Hop", artists: ["Kendrick Lamar", "J. Cole", "Vince Staples", "Noname"], taxonomyPath: ["Hip Hop", "Conscious Rap"] },
  { id: "r-and-b", label: "R&B", artists: ["SZA", "Frank Ocean", "Daniel Caesar", "Snoh Aalegra"], taxonomyPath: ["R&B", "Alternative R&B"] },
  { id: "pop", label: "Pop", artists: ["Taylor Swift", "Lorde", "Billie Eilish", "Charli XCX"], taxonomyPath: ["Pop", "Alt Pop"] },
  { id: "synth-pop", label: "Synth Pop", artists: ["CHVRCHES", "M83", "Passion Pit", "Carly Rae Jepsen"], taxonomyPath: ["Pop", "Electronic", "Synth Pop"] },
  { id: "shoegaze", label: "Shoegaze", artists: ["Beach House", "Slowdive", "Deftones", "Alvvays"], taxonomyPath: ["Rock", "Alternative", "Shoegaze"] },
  { id: "post-punk", label: "Post-Punk", artists: ["Fontaines D.C.", "IDLES", "Parquet Courts", "Dry Cleaning"], taxonomyPath: ["Rock", "Punk", "Post-Punk"] },
];

export const genreEdges: GenreEdge[] = [
  { from: "indie-rock", to: "alt-rock", weight: 0.9 },
  { from: "indie-rock", to: "folk", weight: 0.7 },
  { from: "indie-rock", to: "shoegaze", weight: 0.65 },
  { from: "folk", to: "americana", weight: 0.85 },
  { from: "alt-rock", to: "electronic", weight: 0.5 },
  { from: "alt-rock", to: "post-punk", weight: 0.72 },
  { from: "electronic", to: "house", weight: 0.8 },
  { from: "jazz", to: "soul", weight: 0.75 },
  { from: "soul", to: "r-and-b", weight: 0.8 },
  { from: "hip-hop", to: "r-and-b", weight: 0.7 },
  { from: "pop", to: "synth-pop", weight: 0.85 },
  { from: "indie-rock", to: "pop", weight: 0.55 },
  { from: "electronic", to: "synth-pop", weight: 0.65 },
  { from: "r-and-b", to: "pop", weight: 0.6 },
  { from: "shoegaze", to: "electronic", weight: 0.48 },
  { from: "post-punk", to: "indie-rock", weight: 0.68 },
];

export function getRelatedGenres(genreId: string): GenreEdge[] {
  return genreEdges
    .filter((e) => e.from === genreId || e.to === genreId)
    .sort((a, b) => b.weight - a.weight);
}

export function findArtistGenre(artistQuery: string): GenreNode | null {
  const q = artistQuery.toLowerCase().trim();
  if (!q) return null;
  return (
    genreNodes.find((n) =>
      n.artists.some((a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()))
    ) ?? null
  );
}

export function searchArtists(query: string): { artist: string; genre: GenreNode }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: { artist: string; genre: GenreNode }[] = [];
  for (const node of genreNodes) {
    for (const artist of node.artists) {
      if (artist.toLowerCase().includes(q)) {
        results.push({ artist, genre: node });
      }
    }
  }
  return results.slice(0, 5);
}

export type GenreRecommendation = {
  genre: GenreNode;
  score: number;
  reason: string;
};

export function recommendFromTastes(selectedGenreIds: string[]): GenreRecommendation[] {
  if (selectedGenreIds.length === 0) return [];

  const scores = new Map<string, { score: number; reasons: string[] }>();

  for (const id of selectedGenreIds) {
    for (const edge of getRelatedGenres(id)) {
      const otherId = edge.from === id ? edge.to : edge.from;
      if (selectedGenreIds.includes(otherId)) continue;
      const existing = scores.get(otherId) ?? { score: 0, reasons: [] };
      const source = genreNodes.find((n) => n.id === id);
      existing.score += edge.weight;
      if (source) existing.reasons.push(source.label);
      scores.set(otherId, existing);
    }
  }

  return [...scores.entries()]
    .map(([id, { score, reasons }]) => {
      const genre = genreNodes.find((n) => n.id === id)!;
      return {
        genre,
        score,
        reason: `Because you like ${reasons.slice(0, 2).join(" + ")}`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function recommendFromArtist(artistQuery: string): GenreRecommendation[] {
  const node = findArtistGenre(artistQuery);
  if (!node) return [];
  return getRelatedGenres(node.id)
    .map((edge) => {
      const otherId = edge.from === node.id ? edge.to : edge.from;
      const genre = genreNodes.find((n) => n.id === otherId)!;
      return {
        genre,
        score: edge.weight,
        reason: `Fans of ${node.artists.find((a) => a.toLowerCase().includes(artistQuery.toLowerCase())) ?? node.artists[0]} also explore`,
      };
    })
    .slice(0, 4);
}
