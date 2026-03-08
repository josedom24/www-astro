export function getExcerpt(body: string, length = 200): string {
  const text = body
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && 
      !l.startsWith('#') && 
      !l.startsWith('!') && 
      !l.startsWith('```') &&
      !l.startsWith('<') && // saltar etiquetas HTML
      !l.startsWith('[<')  // saltar imágenes con enlace HTML
    )
    .find(l => l.length > 50)
    ?.replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/<[^>]+>/g, '') ?? ''; // limpiar HTML inline

  if (!text) return 'Sin descripción.'; // nunca devuelve vacío

  if (text.length <= length) return text;

  const cut = text.slice(0, length);
  const lastSentence = Math.max(
    cut.lastIndexOf('.'),
    cut.lastIndexOf('!'),
    cut.lastIndexOf('?'),
  );

  if (lastSentence > length * 0.5) {
    return text.slice(0, lastSentence + 1);
  }

  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}