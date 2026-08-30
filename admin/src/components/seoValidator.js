// SEO Score & Quality Checklist Validator

export function calculateSeoScore(page) {
  const seo = page?.seo || {};
  const checks = [];
  let score = 0;

  // 1. Title Tag
  if (!seo.title) {
    checks.push({ label: 'Page Title is missing', pass: false, weight: 20 });
  } else if (seo.title.length < 30) {
    checks.push({ label: 'Page Title is too short (recommended: 30-65 chars)', pass: 'warning', weight: 12 });
    score += 12;
  } else if (seo.title.length > 70) {
    checks.push({ label: 'Page Title exceeds 70 chars (may be truncated)', pass: 'warning', weight: 15 });
    score += 15;
  } else {
    checks.push({ label: 'Page Title length is optimal (30-65 chars)', pass: true, weight: 20 });
    score += 20;
  }

  // 2. Meta Description
  if (!seo.description) {
    checks.push({ label: 'Meta Description is missing', pass: false, weight: 25 });
  } else if (seo.description.length < 80) {
    checks.push({ label: 'Meta Description is short (recommended: 80-160 chars)', pass: 'warning', weight: 15 });
    score += 15;
  } else if (seo.description.length > 170) {
    checks.push({ label: 'Meta Description exceeds 170 chars', pass: 'warning', weight: 18 });
    score += 18;
  } else {
    checks.push({ label: 'Meta Description length is optimal (80-160 chars)', pass: true, weight: 25 });
    score += 25;
  }

  // 3. Keywords / Canonical
  if (seo.canonicalUrl) {
    checks.push({ label: 'Canonical URL is set', pass: true, weight: 15 });
    score += 15;
  } else {
    checks.push({ label: 'Canonical URL is missing', pass: 'warning', weight: 8 });
    score += 8;
  }

  // 4. OpenGraph Social Image
  if (seo.ogImage) {
    checks.push({ label: 'OpenGraph Social Card Image present', pass: true, weight: 20 });
    score += 20;
  } else {
    checks.push({ label: 'Social preview image missing', pass: false, weight: 0 });
  }

  // 5. Semantic URL Slug
  if (page?.slug && page.slug.startsWith('/')) {
    checks.push({ label: 'Clean semantic URL slug format', pass: true, weight: 20 });
    score += 20;
  }

  return { score: Math.min(score, 100), checks };
}

export function renderSeoScoreWidget(page) {
  const { score, checks } = calculateSeoScore(page);
  const color = score >= 85 ? '#10b981' : (score >= 65 ? '#f59e0b' : '#ef4444');

  return `
    <div style="background: var(--admin-bg-elevated); padding: 1.25rem; border-radius: var(--admin-radius-md); border: 1px solid var(--admin-border-subtle); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <strong style="font-size: 0.95rem;">Real-Time SEO Quality Score</strong>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">Evaluated against search engine indexing standards</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--admin-font-mono); color: ${color};">
          ${score} / 100
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8rem;">
        ${checks.map(c => `
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span>${c.pass === true ? '✅' : (c.pass === 'warning' ? '⚠️' : '❌')}</span>
            <span style="color: ${c.pass === false ? 'var(--admin-accent-danger)' : 'var(--admin-text-secondary)'};">${c.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
