// Site-wide data: names, menu, affiliations and the home page's hero slides and research directions.
export const site = {
  name: 'OSiV',
  tagline: 'Research & Innovation',
  url: 'https://osiv.net',
  location: 'Ho Chi Minh City, Vietnam',
  address: ['OSiV', '82 Hoang Van Thu Street'],
};

export interface MenuItem {
  label: string;
  href: string;
  children?: { label: string; sub: string; href: string }[];
}

export const menu: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Team', href: '/team/' },
  {
    label: 'Research',
    href: '/research/',
    children: [
      { label: 'Technology & Engineering', sub: 'three papers: video, memory for AI agents, traffic', href: '/research/technology/' },
      { label: 'Economics, Culture & Society', sub: 'papers and projects: policy, heritage, agriculture, tourism', href: '/research/society/' },
    ],
  },
  {
    label: 'Projects',
    href: '/projects/',
    children: [
      { label: 'Ongoing', sub: 'projects in progress', href: '/projects/#ongoing' },
      { label: 'Completed', sub: 'finished and submitted work', href: '/projects/#completed' },
    ],
  },
  { label: 'Publications', href: '/publications/' },
  { label: 'News & Blog', href: '/news/' },
  { label: 'Join us', href: '/join/' },
  { label: 'Contact', href: '/contact/' },
];

export const affiliations = [
  { logo: '/img/logos/hcmut.png', name: 'HCMUT, VNU-HCM', sub: 'Ho Chi Minh City University of Technology' },
  { text: 'HUIT', name: 'HUIT', sub: 'Ho Chi Minh City University of Industry and Trade' },
  { logo: '/img/logos/hcmcou.png', name: 'HCMC Open University', sub: 'Ho Chi Minh City Open University' },
  { logo: '/img/logos/vlu.png', name: 'Van Lang University', sub: 'Ho Chi Minh City' },
  { logo: '/img/logos/huflit.png', name: 'HUFLIT', sub: 'University of Foreign Languages and Information Technology' },
  { text: 'DOST', name: 'Provincial DOSTs', sub: 'An Giang · Dong Thap · Gia Lai · Lam Dong' },
];

/** The three research directions shown as image tiles on the home page. */
export const directions = [
  { title: 'trustworthy AI perception', sub: 'video understanding, memory for AI agents, and city-scale prediction', image: '/img/themes/ai-city.jpg', href: '/research/technology/' },
  { title: 'digital value chains', sub: 'traceability, farm data, and forecasting for local producers', image: '/img/projects/pineapple.jpg', href: '/research/society/' },
  { title: 'heritage and smart tourism', sub: 'tacit knowledge, cultural heritage, and AI-guided visits', image: '/img/projects/yellow-apricot.jpg', position: '50% 40%', href: '/research/society/' },
];

/** Slides of the home page hero. `fig` slides are figures on white and are shown whole. */
export const heroSlides = [
  { image: '/img/papers/clp-framework.png', fig: true, title: 'Symbolic AI adoption in emerging-market firms', meta: 'accepted 2026', text: 'why firms announce AI before they can use it, and when that turns into real capability', href: '/publications/', dot: 'Symbolic AI adoption' },
  { image: '/img/papers/coffee-energy.png', fig: true, title: 'Spent coffee grounds as solid biofuel', meta: 'under review', text: 'where pressing, drying and solids loss make the conversion worthwhile', href: '/publications/', dot: 'Spent coffee grounds' },
  { image: '/papers/static/images/fig1_overview.png', fig: true, title: 'Probabilistic structured event modeling', meta: 'ACCV 2026', text: 'video event retrieval that stays reliable when perception is uncertain', href: '/papers/', dot: 'ACCV 2026' },
  { image: '/papers/24h-gnn/static/images/fig2b_taxi_heatmap.jpg', position: '40% 38%', title: '24H-GNN: city-wide traffic flow prediction', meta: 'ICISN 2026', text: 'pattern-driven pseudo-label fusion on a graph network', href: '/papers/24h-gnn/', dot: '24H-GNN' },
  { image: '/img/projects/mui-ne.jpg', position: '50% 45%', title: 'AI for smart tourism at Mui Ne', meta: 'project', text: 'capturing and transferring local knowledge for green, smart tourism', href: '/projects/mui-ne-heritage/', dot: 'Mui Ne' },
  { image: '/img/team-banner.jpg', position: '50% 40%', title: 'Team OSiV', meta: '', text: 'meet the people behind our research', href: '/team/', dot: 'Team OSiV' },
];

export const homeIntro =
  'OSiV is a young research group in Ho Chi Minh City working on reliable AI and on the digital transformation of local economies, culture and heritage. We publish at international conferences and in Vietnamese journals, prepare applied projects with provincial Departments of Science and Technology, and train young researchers from a first question to a submitted paper.';
