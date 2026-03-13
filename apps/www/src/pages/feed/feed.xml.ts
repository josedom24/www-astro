import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';
import { getPostDate } from '@pledin/ui/utils/date';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf());

  const microposts = (await getCollection('microblog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const blogItems = posts.map(post => {
    const slug = post.data.slug ?? post.id;
    const url = `${context.site}${slug.replace(/^blog\//, '')}/`;
    const html = (marked(post.body ?? '') as string)
      .replace(/src="\/pledin\//g, `src="https://www.josedomingo.org/pledin/`);
    return {
      title: post.data.title,
      pubDate: getPostDate(post),
      description: post.data.excerpt ?? '',
      content: html,
      link: url,
      categories: ['blog'],
    };
  });

  const microItems = await Promise.all(microposts.map(async post => {
    const match = post.id.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/);
    const url = match
      ? `${context.site}microblog/${match[1]}/${match[2]}/${match[3]}/`
      : `${context.site}microblog/${post.id}/`;
    const { Content } = await render(post);
    const html = (marked(post.body ?? '') as string)
      .replace(/src="\/pledin\//g, `src="https://www.josedomingo.org/pledin/`);
    return {
      title: post.data.title,
      pubDate: post.data.date,
      description: '',
      content: html,
      link: url,
      categories: ['microblog'],
    };
  }));

  const items = [...blogItems, ...microItems]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Blog de Pledin',
    description: 'Blog personal de José Domingo Muñoz',
    site: context.site!,
    trailingSlash: true,
    items,
  });
}