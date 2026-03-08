import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';
import { getPostDate } from '../../utils/date';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf());

  return rss({
    title: 'Blog de Pledin',
    description: 'Blog personal de José Domingo Muñoz',
    site: context.site!,
    trailingSlash: true,
    items: posts.map(post => {
      const slug = post.data.slug ?? post.id;
      const url = `${context.site}${slug.replace(/^blog\//, '')}/`;
      const html = (marked(post.body ?? '') as string)
       .replace(/src="\/pledin\//g, `src="https://www.josedomingo.org/pledin/`);
      return {
        title: post.data.title,
        pubDate: getPostDate(post),
        description: post.data.excerpt ?? '',
        content: html as string,
        link: url,
      };
    }),
  });
}