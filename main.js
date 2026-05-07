// ===== DATA =====
const artworks = [
  {
    id: 1,
    title: 'Cloud & Tifa — 戰鬥待命',
    desc: '克勞德與蒂法並肩而立，準備迎戰的經典雙人姿態。高精度臉部建模展現細膩的光影與材質。',
    image: 'images/6e019023953ce757af4680e4c01557x5.jpeg',
    category: 'character',
    tags: ['Cloud', 'Tifa', 'FF7'],
    resolution: '1920 × 1080',
    likes: 342,
  },
  {
    id: 2,
    title: 'Cloud Strife — 米德加之夜',
    desc: '背負巨劍的克勞德俯瞰米德加夜景，魔晄爐的冷綠光輝與城市霓虹交織成科幻末世氛圍。',
    image: 'images/876a45d8183b886a146736c7c11557w5.jpeg',
    category: 'scene',
    tags: ['Cloud', 'Midgar', '場景'],
    resolution: '1920 × 1080',
    likes: 528,
  },
  {
    id: 3,
    title: '雪崩小隊 — 黃昏集結',
    desc: 'Red XIII、艾莉絲、克勞德、乃至巴雷特與蒂法，全員集結於米德加頂端，夕陽為背景的史詩級團體照。',
    image: 'images/9c0eafefefbad70f723cbb9f2f17rj95.jpeg',
    category: 'group',
    tags: ['全員', '黃昏', '團體'],
    resolution: '2560 × 1440',
    likes: 891,
  },
  {
    id: 4,
    title: '旅途的彼方 — 全員遠眺',
    desc: '穿越重重險阻後，全體夥伴站在懸崖之上遠眺雪山，莫古利與仙人掌傑克也在其中。壯闊場景的終極渲染。',
    image: 'images/kZQyWBL.png',
    category: 'group',
    tags: ['全員', '風景', 'Rebirth'],
    resolution: '4096 × 2160',
    likes: 1204,
  },
];

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SEARCH =====
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');

searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) searchInput.focus();
});
searchClose.addEventListener('click', () => {
  searchBar.classList.remove('open');
  searchInput.value = '';
  renderGallery(artworks);
});
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = artworks.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.desc.toLowerCase().includes(q)
  );
  renderGallery(filtered);
});

// ===== FILTER =====
document.querySelectorAll('.filter-tag').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tag').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const filtered = filter === 'all' ? artworks : artworks.filter((a) => a.category === filter);
    renderGallery(filtered);
  });
});

// ===== GALLERY RENDER =====
function renderGallery(items) {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = items
    .map(
      (art) => `
    <div class="gallery-card" data-id="${art.id}">
      <div class="card-image-wrap">
        <img src="${art.image}" alt="${art.title}" loading="lazy">
        <div class="card-overlay">
          <div class="overlay-actions">
            <button class="overlay-btn view" onclick="openLightbox(${art.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              查看大圖
            </button>
            <button class="overlay-btn download" onclick="event.stopPropagation(); downloadImage(${art.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              下載
            </button>
          </div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-title">${art.title}</div>
        <div class="card-meta">
          <span class="card-category">${art.category}</span>
          <span class="card-res">${art.resolution}</span>
        </div>
        <div class="card-tags">${art.tags.map((t) => `<span class="card-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `
    )
    .join('');

  // Animate in
  requestAnimationFrame(() => {
    grid.querySelectorAll('.gallery-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });
  });

  // Click to open lightbox
  grid.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.overlay-btn')) return;
      openLightbox(parseInt(card.dataset.id));
    });
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxTags = document.getElementById('lightboxTags');
const lightboxDownload = document.getElementById('lightboxDownload');
const lightboxLike = document.getElementById('lightboxLike');
const likeCount = document.getElementById('likeCount');
let currentArt = null;

function openLightbox(id) {
  currentArt = artworks.find((a) => a.id === id);
  if (!currentArt) return;
  lightboxImg.src = currentArt.image;
  lightboxImg.alt = currentArt.title;
  lightboxTitle.textContent = currentArt.title;
  lightboxDesc.textContent = currentArt.desc;
  lightboxTags.innerHTML = currentArt.tags.map((t) => `<span class="card-tag">${t}</span>`).join('');
  likeCount.textContent = currentArt.likes;

  const liked = localStorage.getItem(`liked_${id}`);
  lightboxLike.classList.toggle('liked', !!liked);

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Download
lightboxDownload.addEventListener('click', () => {
  if (currentArt) downloadImage(currentArt.id);
});

function downloadImage(id) {
  const art = artworks.find((a) => a.id === id);
  if (!art) return;
  const a = document.createElement('a');
  a.href = art.image;
  a.download = art.title.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_') + '.' + art.image.split('.').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('下載已開始！');
}

// Like
lightboxLike.addEventListener('click', () => {
  if (!currentArt) return;
  const key = `liked_${currentArt.id}`;
  const liked = localStorage.getItem(key);
  if (liked) {
    localStorage.removeItem(key);
    currentArt.likes--;
    lightboxLike.classList.remove('liked');
  } else {
    localStorage.setItem(key, '1');
    currentArt.likes++;
    lightboxLike.classList.add('liked');
  }
  likeCount.textContent = currentArt.likes;
});

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: ${Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent2)'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
      25% { transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * -60}px) scale(1.5); opacity: 0.6; }
      50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px) scale(1); opacity: 0.3; }
      75% { transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * -20}px) scale(1.3); opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number, .stat-num').forEach((el) => {
    const target = parseInt(el.dataset.target);
    if (!target || el.dataset.animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !el.dataset.animated) {
            el.dataset.animated = 'true';
            let current = 0;
            const step = target / 60;
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = Math.floor(current).toLocaleString();
            }, 25);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
  });
}

// ===== STAT BARS =====
function animateStatBars() {
  document.querySelectorAll('.stat-bar-fill').forEach((bar) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) bar.classList.add('animated');
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(bar);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderGallery(artworks);
  animateCounters();
  animateStatBars();
});
