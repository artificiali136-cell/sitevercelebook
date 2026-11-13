/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

const cards = [
  {
    id: 'card-1',
    title: 'She Walked In,you froze.',
    image: 'https://artificiali136-cell.github.io/ftsebookracheladams/q.png',
    text: 'You noticed her, but your mind filled with excuses and you stayed seated. Learn how to turn that first look into confidence.',
  },
  {
    id: 'card-2',
    title: 'One Smile, one Move.',
    image: 'https://artificiali136-cell.github.io/ftsebookracheladams/qw.jpg',
    text: 'The guy who gets her number just takes one small step. A calm approach and a simple line are enough.',
  },
  {
    id: 'card-3',
    title: 'The message that gets a yes',
    image: 'https://artificiali136-cell.github.io/ftsebookracheladams/qwe.jpg',
    text: 'Getting her number is only half the game. Send the right message and she’ll be waiting for your reply.',
  },
  {
    id: 'card-4',
    title: 'Now it’s your turn',
    image: 'https://artificiali136-cell.github.io/ftsebookracheladams/qwer.jpg',
    text: 'A relaxed dinner, great conversation, and her smiling across the table. It’s a skill, and skills can be learned.',
  },
];

const faqs = [
  {
    id: 'faq-1',
    question: 'Is this a physical book?',
    answer:
      'It is an instant digital download in PDF format. You can read it immediately on your iPhone, Android, tablet, or computer.',
  },
  {
    id: 'faq-2',
    question: 'How do I receive the ebook after purchase?',
    answer:
      'As soon as your payment is confirmed, you will be redirected to an instant download page, and an access link will be sent directly to your email inbox.',
  },
  {
    id: 'faq-3',
    question: 'Does this work if I am shy or introverted?',
    answer:
      "Yes! The guide doesn't ask you to become a loud extrovert or pretend to be someone you're not. It focuses on calm body language, situational awareness, and authentic conversation methods that foster quiet, natural confidence.",
  },
  {
    id: 'faq-4',
    question: 'What age group is this for?',
    answer:
      'While specifically designed for men between 18 and 40, the principles of female psychology, respect, and natural conversation apply universally, regardless of age or background.',
  },
  {
    id: 'faq-5',
    question: 'Is my payment secure?',
    answer:
      "100% secure. All transactions are encrypted with industry-standard 256-bit SSL encryption and processed through Hotmart's secure global payment system.",
  },
];

export default function App() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('https://pay.hotmart.com/K107961388L?checkoutMode=2');

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    const jq = (window as unknown as { jQuery?: { fancybox?: { close: () => void } } }).jQuery;
    if (jq && jq.fancybox) {
      try {
        jq.fancybox.close();
      } catch {
        // ignora se não estiver ativo
      }
    }
    document.querySelectorAll('.fancybox-overlay, .fancybox-wrap').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  };

  const handleCheckoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const targetUrl = e.currentTarget.getAttribute('href') || 'https://pay.hotmart.com/K107961388L?checkoutMode=2';
    setCheckoutUrl(targetUrl);

    const isMobile = window.innerWidth <= 640 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsCheckoutOpen(true);
      return;
    }

    const jq = (window as unknown as { jQuery?: { fancybox?: { open: (opts: unknown) => void } } }).jQuery;
    if (jq && jq.fancybox) {
      try {
        jq.fancybox.open({
          src: targetUrl,
          type: 'iframe',
          toolbar: false,
          smallBtn: true,
          iframe: { css: { width: '600px' }, attr: { allowpaymentrequest: 'true' } },
        });
        e.preventDefault();
      } catch {
        // continua com a navegação normal
      }
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const scrollToCheckout = () => {
    const isMob = window.innerWidth <= 640;
    const checkoutElement = isMob
      ? document.getElementById('checkout-section') || document.getElementById('checkout-section-desktop')
      : document.getElementById('checkout-section-desktop') || document.getElementById('checkout-section');
    if (checkoutElement) {
      checkoutElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.touches[0].clientX;
    const deltaY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
      window.scrollBy({ top: deltaX * 1.2, behavior: 'auto' });
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (!frameRef.current || !showcaseRef.current || window.innerWidth > 640) {
        if (showcaseRef.current) showcaseRef.current.style.height = 'auto';
        return;
      }
      const frameHeight = frameRef.current.offsetHeight;
      const scrollDistance = 750;
      showcaseRef.current.style.height = `${frameHeight + scrollDistance}px`;
    };

    const handleScroll = () => {
      if (!showcaseRef.current || !trackRef.current || !frameRef.current || window.innerWidth > 640) {
        if (trackRef.current) trackRef.current.style.transform = 'none';
        return;
      }

      const rect = showcaseRef.current.getBoundingClientRect();
      const stickyOffset = 48;
      const scrollDistance = 750;

      const currentScroll = stickyOffset - rect.top;
      const raw = currentScroll / scrollDistance;
      const clamped = Math.min(Math.max(raw, 0), 1);

      const frameWidth = frameRef.current.clientWidth;
      const gap = 16;
      const maxShift = (cards.length - 1) * (frameWidth + gap);

      trackRef.current.style.transform = `translateX(-${clamped * maxShift}px)`;
    };

    updateDimensions();
    handleScroll();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      handleScroll();
    });

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current);
    }

    const timer = setTimeout(updateDimensions, 350);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Importa o script e stylesheet do widget da Hotmart
    const importHotmart = () => {
      if (!document.querySelector('script[src*="checkout/widget.min.js"]')) {
        const imported = document.createElement('script');
        imported.src = 'https://static.hotmart.com/checkout/widget.min.js';
        document.head.appendChild(imported);
      }
      if (!document.querySelector('link[href*="hotmart-fb.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
        document.head.appendChild(link);
      }
    };
    importHotmart();

    const handleMutation = () => {
      const isMobile = window.innerWidth <= 640 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
      if (!isMobile) return;
      const fbWrap = document.querySelector('.fancybox-wrap') as HTMLElement | null;
      const fbOverlay = document.querySelector('.fancybox-overlay') as HTMLElement | null;
      const isVisible = (fbWrap && fbWrap.style.display !== 'none') || (fbOverlay && fbOverlay.style.display !== 'none');
      if (isVisible) {
        const fbFrame = fbWrap?.querySelector('iframe') as HTMLIFrameElement | null;
        if (fbFrame?.src) {
          setCheckoutUrl(fbFrame.src);
        }
        setIsCheckoutOpen(true);
        if (fbWrap) fbWrap.style.display = 'none';
        if (fbOverlay) fbOverlay.style.display = 'none';
      }
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="shell">
      <div className="top-left">
        <span className="symbol-span" style={{ fontSize: '1.2rem' }}>
          <svg viewBox="0 0 24 24" width="1.25rem" height="1.25rem" style={{ display: 'block' }}>
            <polygon
              points="12,2.5 21.5,12 12,21.5 2.5,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="12,8.5 15.5,12 12,15.5 8.5,12"
              fill="var(--ink)"
            />
          </svg>
        </span>
      </div>

      <div className="top-center">
        <span
          className="meta-tag"
          style={{ marginBottom: 0, display: 'inline-block', textAlign: 'center', lineHeight: 1.2 }}
        >
          Online<br />Ebook
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', opacity: 0.5 }}>
          0/20
        </span>
      </div>

      <div className="top-right"></div>

      <div className="mid-left">
        <div className="vertical-text">By Rachel adams &amp; Luiz Eduardo</div>
        <svg
          className="diagonal-divider"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <polyline
            points="100,0 100,76 0,84"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="content">
        <div className="meta-tag">Here You Learn</div>
        <h1>
          <span className="drop-word word-1">FIND</span>{' '}
          <span className="drop-word word-2">OUT</span>{' '}
          <span className="drop-word word-3">HOW</span>{' '}
          <span className="drop-word word-4">SHE</span>{' '}
          <span className="drop-word word-5">THINKS</span>
        </h1>
        <div className="ornament"></div>
        <div className="intro-scroll-box">
          <p>
            You’ve been there: you see a woman who catches your eye, your heart starts racing, and instead of going to talk to her, you stay frozen. Minutes later she’s gone, and you’re left with the same question: “What if I had said something?” The good news is, this isn’t bad luck or bad looks. It’s just not knowing what to do. In this guide, you’ll learn simple steps, from the first glance to the first dinner, so you never miss a chance again because you didn’t know what to say
          </p>

          {/* Tablet e Computador: 4 imagens em grupos de 2 (2 em cima e 2 em baixo) */}
          <div className="desktop-sections">
            {cards.map((card) => (
              <div key={card.id} className="section-block">
                <h2 className="section-title">{card.title}</h2>
                <img
                  src={card.image}
                  alt={card.title}
                  className="section-image"
                  loading="lazy"
                />
                <p className="section-subtext">{card.text}</p>
              </div>
            ))}
          </div>

          {/* Celular: carrossel guiado por rolagem com 4 imagens inteiras e títulos sem corte */}
          <div className="mobile-scroll-container" ref={showcaseRef}>
            <div className="mobile-sticky-frame" ref={frameRef}>
              <div
                className="mobile-images-track"
                ref={trackRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {cards.map((card) => (
                  <div
                    key={`mobile-${card.id}`}
                    className="mobile-scroll-card"
                  >
                    <h2 className="section-title">{card.title}</h2>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="section-image"
                      loading="lazy"
                    />
                    <p className="section-subtext">{card.text}</p>
                  </div>
                ))}
              </div>

              {/* No celular: o relógio fica diretamente embaixo do carrossel para não haver espaço branco */}
              <section className="wait mobile-wait">
                <h2>Stop Waiting for the Right Moment. Learn It and Take Action.</h2>
                <svg className="clock" viewBox="0 0 100 100" width="120" height="120">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="4" />
                  <line
                    className="hour"
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="28"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    className="min"
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="15"
                    stroke="#e63946"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="3" fill="#fff" />
                </svg>
                <p>While you wait, another man is taking your place.</p>
              </section>

              {/* No celular: o ebook e a oferta ficam visíveis logo abaixo do relógio desde a 1ª imagem sem espaço branco */}
              <section className="offer-section mobile-offer" id="checkout-section">
                <h2 className="offer-title">Ready to Approach with Confidence?</h2>
                <div className="offer-image-wrap">
                  <img
                    src="https://artificiali136-cell.github.io/ftsebookracheladams/Show_closer_up_on_white_20261015234432.jpg"
                    alt="Find Out How She Thinks Guide"
                    className="offer-image"
                    loading="lazy"
                  />
                </div>
                <p className="offer-subtitle">
                  Download &ldquo;Find Out How She Thinks&rdquo; right now and discover how approaching women can be simple, natural, and enjoyable.
                </p>

                <div className="pricing-box">
                  <span className="pricing-tag">Special One-Time Investment</span>
                  <div className="pricing-value">
                    <span className="price-number">$ 9</span>
                    <span className="price-currency">USD</span>
                  </div>
                  <span className="price-regular">Regular Price: $14 USD</span>
                </div>

                <ul className="benefit-list">
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Instant access to the complete 20-page PDF guide.</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Practical breakdown of female psychology and first impressions.</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Word-for-word openers and conversation transitions.</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Body language and posture exercises to build confidence.</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Mobile-optimized PDF for easy reading anytime, anywhere.</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Backed by a 7-day money-back guarantee.</span>
                  </li>
                </ul>

                <div className="checkout-btn-wrap">
                  <a
                    href="https://pay.hotmart.com/K107961388L?checkoutMode=2"
                    className="hotmart-fb hotmart__button-checkout"
                    onClick={handleCheckoutClick}
                  >
                    <img
                      src="https://static.hotmart.com/img/btn-buy-green.png"
                      alt="Buy Now"
                      className="hotmart-btn-img"
                    />
                  </a>
                </div>
              </section>
            </div>
          </div>

          {/* Seção Animação Relógio Desktop/Tablet */}
          <section className="wait desktop-wait">
            <h2>Stop Waiting for the Right Moment. Learn It and Take Action.</h2>
            <svg className="clock" viewBox="0 0 100 100" width="120" height="120">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="4" />
              <line
                className="hour"
                x1="50"
                y1="50"
                x2="50"
                y2="28"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                className="min"
                x1="50"
                y1="50"
                x2="50"
                y2="15"
                stroke="#e63946"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="3" fill="#fff" />
            </svg>
            <p>While you wait, another man is taking your place.</p>
          </section>

          {/* Seção da Oferta e Checkout Hotmart Desktop */}
          <section className="offer-section desktop-offer" id="checkout-section-desktop">
            <h2 className="offer-title">Ready to Approach with Confidence?</h2>
            <div className="offer-image-wrap">
              <img
                src="https://artificiali136-cell.github.io/ftsebookracheladams/Show_closer_up_on_white_20261015234432.jpg"
                alt="Find Out How She Thinks Guide"
                className="offer-image"
                loading="lazy"
              />
            </div>
            <p className="offer-subtitle">
              Download &ldquo;Find Out How She Thinks&rdquo; right now and discover how approaching women can be simple, natural, and enjoyable.
            </p>

            <div className="pricing-box">
              <span className="pricing-tag">Special One-Time Investment</span>
              <div className="pricing-value">
                <span className="price-number">$ 9</span>
                <span className="price-currency">USD</span>
              </div>
              <span className="price-regular">Regular Price: $14 USD</span>
            </div>

            <ul className="benefit-list">
              <li>
                <span className="check-mark">✓</span>
                <span>Instant access to the complete 20-page PDF guide.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Practical breakdown of female psychology and first impressions.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Word-for-word openers and conversation transitions.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Body language and posture exercises to build confidence.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Mobile-optimized PDF for easy reading anytime, anywhere.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Backed by a 7-day money-back guarantee.</span>
              </li>
            </ul>

            <div className="checkout-btn-wrap">
              <a
                href="https://pay.hotmart.com/K107961388L?checkoutMode=2"
                className="hotmart-fb hotmart__button-checkout"
                onClick={handleCheckoutClick}
              >
                <img
                  src="https://static.hotmart.com/img/btn-buy-green.png"
                  alt="Buy Now"
                  className="hotmart-btn-img"
                />
              </a>
            </div>
          </section>

          {/* Seção Ebook Relacionamento (Para todos os tamanhos de tela) */}
          <section className="relationship-section">
            <div className="relationship-top">
              <div className="relationship-left">
                <div className="relationship-heading-row">
                  <h2 className="relationship-title">
                    For those who are already
                    <br />
                    in a relationship
                  </h2>
                  <svg
                    className="relationship-arrow"
                    viewBox="0 0 38 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 12H31M31 12L22 4.5M31 12L22 19.5"
                      stroke="currentColor"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="relationship-price-block">
                  <div className="relationship-price-current">$12 USD</div>
                  <div className="relationship-price-old">Old price: $23 USD</div>
                </div>
              </div>

              <div className="relationship-right">
                <img
                  src="https://artificiali136-cell.github.io/ftsebookracheladams/Woman_leaning_on_man_shoulders_f1c77d94.jpg"
                  alt="For those who are already in a relationship"
                  className="relationship-image"
                  loading="lazy"
                />
              </div>
            </div>

            <ul className="benefit-list">
              <li>
                <span className="check-mark">✓</span>
                <span>Instant access to the complete 40-page PDF guide.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Practical advice to rebuild connection, interest, and respect in your relationship.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Conversation examples for handling distance, conflict, and important discussions.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Natural, thoughtful messages to send to your girlfriend or wife.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>A weekly relationship checklist and a practical 30-day improvement plan.</span>
              </li>
              <li>
                <span className="check-mark">✓</span>
                <span>Easy-to-read PDF format for convenient reading on your phone.</span>
              </li>
            </ul>

            <div className="checkout-btn-wrap">
              <a
                href="https://pay.hotmart.com/B108482566W?checkoutMode=2"
                className="hotmart-fb hotmart__button-checkout"
                onClick={handleCheckoutClick}
              >
                <img
                  src="https://static.hotmart.com/img/btn-buy-green.png"
                  alt="Buy Now"
                  className="hotmart-btn-img"
                />
              </a>
            </div>
          </section>

          {/* Seção WHAT READERS ARE SAYING (Abaixo do checkout) */}
          <section className="testimonials-section">
            <span className="testimonials-tag">WHAT READERS ARE SAYING</span>
            <h2 className="testimonials-title">Real Guys. Real Breakthroughs.</h2>
            <p className="testimonials-subtitle">
              Feedback from men across the US who put the principles of &ldquo;How she thinks&rdquo; to work.
            </p>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="star-rating" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      width="18"
                      height="18"
                      fill="#E5A912"
                      className="star-icon"
                    >
                      <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-quote">
                  &ldquo;I used to literally freeze every time I saw a girl I found attractive. Chapter 3 on situational timing changed everything for me. Approached someone at a bookstore last weekend without breaking a sweat, and we went on our second date yesterday.&rdquo;
                </p>
                <div className="testimonial-author">
                  <span className="author-name">Marcus T.</span>
                  <span className="author-meta">Age 26 • Austin, TX</span>
                  <span className="author-badge">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="#2e7d32">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Verified Buyer of &ldquo;How she thinks&rdquo;
                  </span>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="star-rating" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      width="18"
                      height="18"
                      fill="#E5A912"
                      className="star-icon"
                    >
                      <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-quote">
                  &ldquo;I used to think being a good partner was simply about providing and being there. This guide helped me realize how important emotional support, patience, and small gestures are. It gave me a different perspective on how to build a stronger relationship.&rdquo;
                </p>
                <div className="testimonial-author">
                  <span className="author-name">Rick T.</span>
                  <span className="author-meta">Age 38 • Austin, TX</span>
                  <span className="author-badge">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="#2e7d32">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Verified buyer of &ldquo;Code of Man&rdquo;
                  </span>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="star-rating" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      width="18"
                      height="18"
                      fill="#E5A912"
                      className="star-icon"
                    >
                      <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-quote">
                  &ldquo;We had fallen into the same routine, and I didn’t know how to bring it up without starting another argument. This guide gave me practical ways to listen better, show appreciation, and make time for us again. For $12, it was worth the read.&rdquo;
                </p>
                <div className="testimonial-author">
                  <span className="author-name">Daniel M.</span>
                  <span className="author-meta">Age 34 • Seattle, WA</span>
                  <span className="author-badge">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="#2e7d32">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    Verified Buyer of &ldquo;Code of man&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Seção FAQ - Perguntas Frequentes (Abaixo das Avaliações) */}
          <section className="faq-section">
            <span className="faq-tag">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="faq-title">Got Questions? We’ve Got Answers.</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.id}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s ease',
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-box">
                        <p className="faq-answer-text">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="faq-cta-wrap">
              <button
                type="button"
                className="faq-cta-btn"
                onClick={scrollToCheckout}
              >
                Get the ebook now
              </button>
            </div>
          </section>

          {/* Linha separadora preta e fina abaixo das perguntas */}
          <div className="faq-divider-line"></div>
        </div>
      </div>

      <div className="mid-right">
        <svg
          className="diagonal-divider"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <polyline
            points="0,0 0,76 100,84"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>

    {/* Rodapé de Parceria - EdgitalStudio */}
    <footer className="partner">
      <div className="partner-container">
        {/* Esquerda: Texto + Botão */}
        <div className="partner-left">
          <p className="partner-text">
            Website built in partnership with <strong>EdgitalStudio</strong>
          </p>
          <a
            className="partner-btn"
            href="https://instagram.com/edgitalstudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="ig"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            See Their Work on Instagram
          </a>
        </div>
        {/* Direita: Logotipo bem maior */}
        <div className="partner-right">
          <img
            className="partner-logo"
            src="https://artificiali136-cell.github.io/EdgitalStudio/digital.png"
            alt="EdgitalStudio Logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </footer>

    {/* Modal de Checkout no celular com botão explícito de voltar para o site */}
    {isCheckoutOpen && (
      <div className="mobile-checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">
        <div className="mobile-checkout-bar">
          <button
            type="button"
            className="mobile-back-site-btn"
            onClick={handleCloseCheckout}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Back to site</span>
          </button>
        </div>
        <iframe
          src={checkoutUrl}
          title="Checkout Hotmart"
          className="mobile-checkout-frame"
          allow="payment"
        />
      </div>
    )}
  </>
);
}
