import type { ElementObject } from '@oakjs/core';

/*
 * Content shared by the stories (not part of the package)
 */

const offer = ({
  name,
  price,
  period,
  perks,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  perks: string[];
  highlighted?: boolean;
}): ElementObject => ({
  type: 'col',
  size: 6,
  responsive: { xs: 12 },
  styles: {
    paddingTop: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    borderTop: '1px',
    borderRight: '1px',
    borderBottom: '1px',
    borderLeft: '1px',
    borderTopColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderRightColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderBottomColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderLeftColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    borderBottomLeftRadius: '12px',
    backgroundColor: highlighted ? '#F6F6FD' : '#FFFFFF',
    // Used when the content is displayed in dark mode
    dark: {
      backgroundColor: highlighted ? '#2A284B' : '#1C1C1C',
      borderTopColor: highlighted ? '#5C56DF' : '#333333',
      borderRightColor: highlighted ? '#5C56DF' : '#333333',
      borderBottomColor: highlighted ? '#5C56DF' : '#333333',
      borderLeftColor: highlighted ? '#5C56DF' : '#333333',
    },
  },
  content: [
    { type: 'title', headingLevel: 'h3', content: name },
    {
      type: 'text',
      content: `<p><strong style="font-size: 28px">${price}</strong>` +
        ` / ${period}</p>`,
    },
    {
      type: 'text',
      content: `<ul>${perks.map(p => `<li>${p}</li>`).join('')}</ul>`,
    },
    { type: 'empty-space', settings: { height: '8px' } },
    {
      type: 'button',
      content: `Subscribe ${period === 'month' ? 'monthly' : 'yearly'}`,
      action: 'link',
      url: 'https://example.com/subscribe',
      styles: highlighted ? {
        backgroundColor: '#5C56DF',
        hover: { backgroundColor: '#4D47CB' },
        dark: {
          backgroundColor: '#5C56DF',
          hover: { backgroundColor: '#807BFC' },
        },
      } : {},
    },
  ],
});

export const paywallContent: ElementObject[] = [
  {
    type: 'image',
    url: 'https://avatars.githubusercontent.com/u/20414672',
    settings: {
      size: 'custom',
      width: '48px',
      height: '48px',
      textAlign: 'left',
      alt: 'The Daily Oak',
    },
  },
  {
    type: 'title',
    headingLevel: 'h2',
    content: 'You\'ve reached your free articles limit',
    styles: { marginBottom: '8px' },
  },
  {
    type: 'text',
    content: '<p>Subscribe to The Daily Oak to keep reading unlimited ' +
      'articles, newsletters & podcasts. Cancel anytime.</p>',
  },
  { type: 'empty-space', settings: { height: '16px' } },
  { type: 'row', settings: { gap: '16px', alignItems: 'stretch' }, cols: [
    offer({
      name: 'Monthly',
      price: '€9.99',
      period: 'month',
      perks: ['Unlimited articles', 'Ad-free reading'],
    }),
    offer({
      name: 'Yearly',
      price: '€89',
      period: 'year',
      perks: ['Unlimited articles', 'Ad-free reading', '2 months free'],
      highlighted: true,
    }),
  ] },
  { type: 'empty-space', settings: { height: '16px' } },
  {
    type: 'foldable',
    seeMore: [{ type: 'text', content: '<p>Why subscribe? ▾</p>' }],
    seeLess: [{ type: 'text', content: '<p>Show less ▴</p>' }],
    content: [{
      type: 'text',
      content: '<p>Our newsroom is 100% funded by readers like you: no ' +
        'billionaire, no clickbait, just independent journalism.</p>',
    }],
  },
  {
    type: 'clickable',
    action: 'event',
    event: 'login',
    content: [{
      type: 'text',
      content: '<p>Already a subscriber? <u>Log in</u></p>',
      styles: { paddingTop: '8px' },
    }],
  },
];

// Gives predictable ids to the elements (e.g. `e4-1` = 2nd col of 5th element)
export const withIds = (elements: ElementObject[], prefix = 'e'): ElementObject[] =>
  elements.map((element, i) => {
    const id = `${prefix}${i}`;
    const copy: ElementObject = { ...element, id };

    ['cols', 'content', 'seeMore', 'seeLess'].forEach(key => {
      if (Array.isArray(element[key])) {
        copy[key] = withIds(element[key], `${id}-`);
      }
    });

    return copy;
  });
