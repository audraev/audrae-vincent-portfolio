const projectNotes = {
  fitness: {
    title: 'Fitness Vault',
    type: 'Fitness dashboard & application · In development',
    description: 'A personal project for recording workouts and making training data easier to understand. The React interface brings workout summaries, weekly mileage, and training-load calculations into one dashboard.',
    features: ['Dashboard totals for workouts, distance, training time, and running sessions.', 'Weekly mileage visualization and training-load analytics based on duration and intensity.', 'Workout-entry form that updates the current dashboard session.', 'Separate FastAPI backend with workout create, read, update, and delete endpoints, plus SQLAlchemy and PostgreSQL support.'],
    note: 'The frontend currently uses sample data and session state. The API exists separately; persistent frontend-to-API integration is still in progress. Preview artwork uses illustrative sample values.',
    tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'SQLAlchemy', 'PostgreSQL'],
    url: 'https://github.com/audraev/fitness-dashboard'
  },
  artheon: {
    title: 'ARTHEON',
    type: 'Business website · In development',
    description: 'The website for the business I’m building. It introduces ARTHEON through network visibility, security, connected devices, and everyday business operations, with a focus on hospitality and teams managing multiple locations.',
    features: ['A multi-page website connecting business technology, security response, connected operations, and the network platform.', 'Read-only product demonstrations and network-topology illustrations using fictional data.', 'Responsive navigation, light and dark themes, and an Observe area for exploring prepared examples.', 'News & Insights with attributed headlines, plus account and learning integration scaffolding.'],
    note: 'This is a marketing preview in active development. Product examples are fictional and do not connect to a live dashboard. Account and newsletter integrations require configuration. The source repository retains its earlier guardian-website name.',
    tags: ['JavaScript', 'Vite', 'HTML & CSS', 'Node.js', 'Responsive design'],
    url: 'https://github.com/audraev/guardian-website'
  }
};

const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let lastProjectTrigger;

function textElement(tag, value, className) {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
}

function createArrowIcon() {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  const attributes = {
    class: 'icon icon-arrow-up-right', viewBox: '0 0 24 24', width: '24', height: '24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false'
  };
  Object.entries(attributes).forEach(([name, value]) => icon.setAttribute(name, value));
  const path = document.createElementNS(namespace, 'path');
  path.setAttribute('d', 'M6 18 18 6M6 6h12v12');
  icon.append(path);
  return icon;
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectNotes[button.dataset.project];
    if (!project) return;
    lastProjectTrigger = button;
    dialogContent.replaceChildren();
    const title = textElement('h2', project.title, 'dialog-title');
    title.id = 'dialog-title';
    dialogContent.append(title, textElement('p', project.type, 'dialog-status'), textElement('p', project.description, 'dialog-description'));
    const tags = document.createElement('div');
    tags.className = 'project-tags';
    project.tags.forEach(tag => tags.append(textElement('span', tag)));
    const details = document.createElement('div');
    details.className = 'dialog-details';
    details.append(textElement('h3', 'Inside the project'));
    const list = document.createElement('ul');
    project.features.forEach(feature => list.append(textElement('li', feature)));
    details.append(list);
    const link = textElement('a', 'View source on GitHub', 'button primary');
    link.append(createArrowIcon());
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    dialogContent.append(tags, details, textElement('p', project.note, 'dialog-footnote'), link);
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lastProjectTrigger?.focus();
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(project => {
      const visible = filter === 'all' || project.dataset.category === filter;
      project.hidden = !visible;
      if (visible) count++;
    });
    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector('#project-count').textContent = `Showing ${count} project${count === 1 ? '' : 's'}`;
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.querySelectorAll('.print-button').forEach(button => button.addEventListener('click', () => window.print()));
