import { visit } from 'unist-util-visit';

const types = {
  note:    { label: 'Nota',       icon: 'ℹ️' },
  tip:     { label: 'Consejo',    icon: '🚀' },
  caution: { label: 'Precaución', icon: '⚠️' },
  danger:  { label: 'Peligro',    icon: '🛑' },
};

export default function remarkAsides() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      const type = node.name;
      if (!types[type]) return;

      const { label, icon } = types[type];
      const title = node.children.find(n => n.data?.directiveLabel)?.children?.[0]?.value ?? label;

      node.data = node.data || {};
      node.data.hName = 'aside';
      node.data.hProperties = { class: `aside aside-${type}` };

      node.children = [
        {
          type: 'paragraph',
          data: { hName: 'p', hProperties: { class: 'aside-title' } },
          children: [{ type: 'text', value: `${icon} ${title}` }],
        },
        {
          type: 'div',
          data: { hName: 'div', hProperties: { class: 'aside-content' } },
          children: node.children.filter(n => !n.data?.directiveLabel),
        },
      ];
    });
  };
}