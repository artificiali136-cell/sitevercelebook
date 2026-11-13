/**
 * Page Script
 * Gerencia o travamento de tela e rolagem guiada no celular para as 4 imagens:
 * - Imagens 100% inteiras sem corte
 * - Títulos ajustados sem corte de texto
 * - Desktop: seções organizadas em colunas lado a lado
 * - Celular: rolagem travada conduzindo a esteira de imagens
 */
document.addEventListener('DOMContentLoaded', () => {
  const showcaseContainer = document.querySelector('.mobile-scroll-container');
  const stickyFrame = document.querySelector('.mobile-sticky-frame');
  const imagesTrack = document.querySelector('.mobile-images-track');
  const scrollCards = document.querySelectorAll('.mobile-scroll-card');

  const updateCardWidths = () => {
    if (!stickyFrame) return;
    const width = stickyFrame.clientWidth;
    scrollCards.forEach((card) => {
      card.style.width = `${width}px`;
    });
  };

  const handleMobileScroll = () => {
    if (!showcaseContainer || !imagesTrack || window.innerWidth > 640) {
      if (imagesTrack) imagesTrack.style.transform = 'none';
      return;
    }

    const rect = showcaseContainer.getBoundingClientRect();
    const stickyOffset = 76;
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - (windowHeight - stickyOffset);
    if (totalScrollable <= 0) return;

    const currentScroll = stickyOffset - rect.top;
    const raw = currentScroll / totalScrollable;
    const clamped = Math.min(Math.max(raw, 0), 1);

    const cardWidth = stickyFrame ? stickyFrame.clientWidth : 280;
    const gap = 24;
    const totalCards = scrollCards.length || 4;
    const maxShift = (totalCards - 1) * (cardWidth + gap);

    // Desloca a esteira pelas 4 imagens
    imagesTrack.style.transform = `translateX(-${clamped * maxShift}px)`;
  };

  window.addEventListener('scroll', handleMobileScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateCardWidths();
    handleMobileScroll();
  });

  updateCardWidths();
  handleMobileScroll();

  // Gerencia o Accordion das Perguntas Frequentes (FAQ)
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      if (!parent) return;
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((item) => item.classList.remove('open'));
      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // Rola até o checkout ao clicar em "Get the ebook now"
  const faqCtaBtn = document.querySelector('.faq-cta-btn');
  if (faqCtaBtn) {
    faqCtaBtn.addEventListener('click', () => {
      const checkoutEl = document.getElementById('checkout-section') || document.querySelector('.offer-section');
      if (checkoutEl) {
        checkoutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  console.log('Site initialized successfully with 4 carousel cards and FAQ.');
});
