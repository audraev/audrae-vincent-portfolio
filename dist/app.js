const projectNotes = {
  fitness: {
    title: 'Fitness Vault',
    type: 'Fitness dashboard & application · In development',
    description: 'A personal project for recording workouts and making training data easier to understand. The React interface brings workout summaries, weekly mileage, and training-load calculations into one dashboard.',
    features: ['Dashboard totals for workouts, distance, training time, and running sessions.', 'Weekly mileage visualization and training-load analytics based on duration and intensity.', 'Workout-entry form that updates the current dashboard session.', 'Separate FastAPI backend with workout create, read, update, and delete endpoints, plus SQLAlchemy and PostgreSQL support.'],
    note: 'The frontend currently uses sample data and session state. The API exists separately; persistent frontend-to-API integration is still in progress. Preview artwork uses illustrative sample values.',
    tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'SQLAlchemy', 'PostgreSQL'],
    slides: [
      { image: 'fitness-overview.jpg', title: 'Training at a glance', description: 'The overview brings total workouts, distance, time, running sessions, and training load into one dashboard.', alt: 'Fitness Vault training overview with summary cards for four sample workouts, 11.3 miles, training time, and training load.' },
      { image: 'fitness-summary.jpg', title: 'Understand the work behind the numbers', description: 'Training summaries combine mileage, time, session counts, and a breakdown of workout types. The current preview uses a small sample dataset.', alt: 'Fitness Vault training summary and a breakdown of running, gym, and soccer sessions.' },
      { image: 'fitness-analytics.jpg', title: 'Follow training volume and recent activity', description: 'Weekly mileage turns recorded distance into a chart, while recent workout cards keep duration, intensity, distance, and pace together.', alt: 'A weekly mileage chart above Fitness Vault’s recent workout list with sample running and gym sessions.' }
    ],
    url: 'https://github.com/audraev/fitness-dashboard'
  },
  artheon: {
    title: 'ARTHEON',
    type: 'Business website · In development',
    description: 'The website for the business I’m building. It introduces ARTHEON through network visibility, security, connected devices, and everyday business operations, with a focus on hospitality and teams managing multiple locations.',
    features: ['A multi-page website connecting business technology, security response, connected operations, and the network platform.', 'Read-only product demonstrations and network-topology illustrations using fictional data.', 'Responsive navigation, light and dark themes, and an Observe area for exploring prepared examples.', 'News & Insights with attributed headlines, plus account and learning integration scaffolding.'],
    note: 'This is a marketing preview in active development. Product examples are fictional and do not connect to a live dashboard. Account and newsletter integrations require configuration. The source repository retains its earlier guardian-website name.',
    tags: ['JavaScript', 'Vite', 'HTML & CSS', 'Node.js', 'Responsive design'],
    slides: [
      { image: 'artheon-home.jpg', title: 'A clear introduction to ARTHEON', description: 'The business website introduces security, device visibility, and everyday operations through an illustrated connected venue and focused navigation.', alt: 'ARTHEON homepage with its castle logo, security and business messaging, and an illustrated connected café.' },
      { image: 'artheon-platform.jpg', title: 'Explore a connected workspace', description: 'The platform preview lets visitors browse prepared examples of network topology, devices, cameras, and business workspaces using fictional data.', alt: 'ARTHEON’s control-center preview displaying a sample network topology and workspace navigation.' },
      { image: 'artheon-observe.jpg', title: 'Make connected equipment easier to understand', description: 'Observe introduces IoT operations through a read-only dashboard preview, showing how equipment status, locations, and readings can be presented together.', alt: 'ARTHEON Observe’s IoT Operations section showing sample connected-equipment information and dashboard controls.' },
      { image: 'artheon-security.jpg', title: 'Connect technology to a working day', description: 'The security story uses an illustrated business to explain how payments, customer information, and shared connections relate to everyday security.', alt: 'ARTHEON’s Why Security page with an illustrated café, people and information, service areas, and shared connections.' }
    ],
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

function createArrowIcon(direction = 'up-right') {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  const attributes = {
    class: `icon icon-arrow-${direction}`, viewBox: '0 0 24 24', width: '24', height: '24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false'
  };
  Object.entries(attributes).forEach(([name, value]) => icon.setAttribute(name, value));
  const path = document.createElementNS(namespace, 'path');
  const paths = { 'up-right': 'M6 18 18 6M6 6h12v12', left: 'M20 12H4m7-7-7 7 7 7', right: 'M4 12h16m-7-7 7 7-7 7', down: 'M12 4v16m-7-7 7 7 7-7' };
  path.setAttribute('d', paths[direction] || paths['up-right']);
  icon.append(path);
  return icon;
}

function createProjectGallery(project) {
  let current = 0;
  const gallery = document.createElement('section');
  gallery.className = 'project-gallery';
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-roledescription', 'carousel');
  gallery.setAttribute('aria-label', `${project.title} visual walkthrough`);
  gallery.tabIndex = 0;

  const figure = document.createElement('figure');
  figure.className = 'project-slide';
  const frame = document.createElement('div');
  frame.className = 'slide-image-wrap';
  const image = document.createElement('img');
  image.className = 'slide-image';
  image.width = 1280;
  image.height = 800;
  image.decoding = 'async';
  image.draggable = false;
  const error = textElement('p', 'This preview could not load. Try another slide.', 'slide-error');
  error.hidden = true;
  image.addEventListener('error', () => { error.hidden = false; image.hidden = true; });
  image.addEventListener('load', () => { error.hidden = true; image.hidden = false; });
  frame.append(image, error);

  const caption = document.createElement('figcaption');
  caption.className = 'slide-caption';
  caption.setAttribute('aria-live', 'polite');
  caption.setAttribute('aria-atomic', 'true');
  const number = textElement('p', '', 'slide-kicker');
  const title = textElement('h3', '');
  const description = textElement('p', '');
  caption.append(number, title, description);
  figure.append(frame, caption);

  const toolbar = document.createElement('div');
  toolbar.className = 'gallery-toolbar';
  const hint = textElement('span', 'Scroll for project details', 'gallery-hint');
  hint.append(createArrowIcon('down'));
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'gallery-arrow';
  previous.setAttribute('aria-label', 'Previous slide');
  previous.append(createArrowIcon('left'));
  const counter = textElement('span', '', 'gallery-counter');
  counter.setAttribute('aria-hidden', 'true');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'gallery-arrow';
  next.setAttribute('aria-label', 'Next slide');
  next.append(createArrowIcon('right'));
  controls.append(previous, next);
  frame.append(controls);
  toolbar.append(hint, counter);

  const thumbnails = document.createElement('div');
  thumbnails.className = 'gallery-thumbnails';
  thumbnails.setAttribute('role', 'group');
  thumbnails.setAttribute('aria-label', 'Choose a project slide');
  const buttons = project.slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumbnail';
    button.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.title}`);
    const thumbnail = document.createElement('img');
    thumbnail.src = `assets/projects/${slide.image}?v=clean-framing-2`;
    thumbnail.alt = '';
    thumbnail.width = 128;
    thumbnail.height = 80;
    thumbnail.loading = 'lazy';
    button.append(thumbnail, textElement('span', String(index + 1).padStart(2, '0')));
    button.addEventListener('click', () => showSlide(index));
    thumbnails.append(button);
    return button;
  });

  function showSlide(index) {
    current = (index + project.slides.length) % project.slides.length;
    const slide = project.slides[current];
    error.hidden = true;
    image.hidden = false;
    image.src = `assets/projects/${slide.image}?v=clean-framing-2`;
    image.alt = slide.alt;
    number.textContent = `SCREEN ${String(current + 1).padStart(2, '0')} / ${String(project.slides.length).padStart(2, '0')}`;
    title.textContent = slide.title;
    description.textContent = slide.description;
    counter.textContent = `${current + 1} / ${project.slides.length}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  previous.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));
  gallery.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    showSlide(event.key === 'Home' ? 0 : event.key === 'End' ? project.slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let pointer;
  frame.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
    if (!event.isPrimary) { pointer = null; return; }
    pointer = { x: event.clientX, y: event.clientY };
  });
  frame.addEventListener('pointerup', event => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) showSlide(current + (dx < 0 ? 1 : -1));
  });
  frame.addEventListener('pointercancel', () => { pointer = null; });
  gallery.append(figure, toolbar, thumbnails, textElement('p', 'Screenshots from development previews. Sample and fictional data.', 'gallery-note'));
  showSlide(0);
  return gallery;
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectNotes[button.dataset.project];
    if (!project) return;
    lastProjectTrigger = button;
    dialogContent.replaceChildren();
    const title = textElement('h2', project.title, 'dialog-title');
    title.id = 'dialog-title';
    const heading = document.createElement('div');
    heading.className = 'project-dialog-heading';
    const identity = document.createElement('div');
    identity.append(title, textElement('p', project.type, 'dialog-status'));
    heading.append(identity, textElement('p', project.description, 'dialog-description'));
    dialogContent.append(heading, createProjectGallery(project));
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
    const about = document.createElement('details');
    about.className = 'project-build-details';
    about.append(textElement('summary', 'Project details & technology'), tags, details, textElement('p', project.note, 'dialog-footnote'));
    const footer = document.createElement('div');
    footer.className = 'project-dialog-footer';
    footer.append(textElement('span', 'Want to look under the hood?'), link);
    dialogContent.append(about, footer);
    dialog.showModal();
    dialog.scrollTop = 0;
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
