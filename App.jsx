import { useEffect, useMemo, useState } from "react";

const collections = [
  {
    id: "shringar-red",
    name: "Shringar Red",
    slug: "bridal-signatures",
    price: 18990,
    weave: "Pure Katan silk with rich zari border",
    mood: "Bridal, heirloom, and wedding rituals",
    note: "A deep sindoor-red Banarasi with a grand pallu and old-gold detailing.",
    tone: "tone-red",
    delivery: "Dispatch in 3 to 5 days"
  },
  {
    id: "ganga-jamuna",
    name: "Ganga Jamuna Teal",
    slug: "festive-classics",
    price: 16450,
    weave: "Soft silk with floral jaal and contrast border",
    mood: "Festive evenings and modern trousseau edits",
    note: "A fluid Banarasi drape in peacock teal with blush and antique-gold accents.",
    tone: "tone-teal",
    delivery: "Dispatch in 2 to 4 days"
  },
  {
    id: "rangmahal-tissue",
    name: "Rangmahal Tissue",
    slug: "couture-tissue",
    price: 21900,
    weave: "Silk tissue with jangla-inspired woven motifs",
    mood: "Reception glamour and couture styling",
    note: "A luminous tissue Banarasi in champagne beige with a dramatic wine border.",
    tone: "tone-champagne",
    delivery: "Made to order in 5 to 7 days"
  }
];

const collectionSections = [
  {
    slug: "bridal-signatures",
    title: "Bridal Signatures",
    text: "Grand Banarasi sarees for weddings, rituals, reception entries, and heirloom gifting."
  },
  {
    slug: "festive-classics",
    title: "Festive Classics",
    text: "Timeless drapes with softer movement, lighter styling, and all-occasion richness."
  },
  {
    slug: "couture-tissue",
    title: "Couture Tissue",
    text: "Luminous statement pieces for editorial dressing, premium events, and standout wardrobe moments."
  }
];

const highlights = [
  {
    title: "Classic luxury layout",
    text: "The storefront now follows a cleaner premium-retail structure with dedicated pages for browsing and brand storytelling."
  },
  {
    title: "Expandable collections system",
    text: "You can add new collection groups and sarees in one data block, and the Collections page will keep scaling with the brand."
  },
  {
    title: "Founder-led identity",
    text: "The About page now has space for your story, positioning, and the people building Zdhoorkya."
  }
];

const rituals = [
  "Handpicked Banarasi edits for bridal wardrobes, festive drops, and heirloom gifting.",
  "Blouse guidance, styling assistance, and fabric notes placed in a luxury-brand voice.",
  "A layout designed to feel rich on desktop while staying elegant and clear on mobile."
];

const reviews = [
  {
    quote: "This feels like a premium saree label, not a generic ecommerce theme.",
    name: "Aditi Sharma",
    role: "Wedding stylist"
  },
  {
    quote: "The presentation adds trust before the customer even asks about fabric or delivery.",
    name: "Naina Kapoor",
    role: "Fashion consultant"
  },
  {
    quote: "The visual direction is exactly what a Banarasi brand needs to look expensive online.",
    name: "Ritwik Sen",
    role: "Brand designer"
  }
];

const founders = [
  {
    name: "Vikas Barman",
    role: "Founder",
    text: "Shapes the long-term vision of Zdhoorkya with a focus on elegance, presentation, and building a premium Indian fashion brand."
  },
  {
    name: "Vansh Barman",
    role: "Co-Founder",
    text: "Drives the next-generation brand perspective across storytelling, growth, and how the collection connects with modern buyers."
  }
];

const sampleProduct = {
  id: "zdh-banarasi-001",
  name: "Royal Gulnaar Banarasi Saree",
  price: 18990,
  shortDescription: "A rich bridal Banarasi saree in deep red with grand zari work and a statement pallu.",
  description:
    "Designed as a hero product for the Zdhoorkya product page, this Banarasi saree blends bridal richness with a polished digital presentation. You can edit this name, price, image, and every line of detail anytime from this single product object.",
  fabric: "Pure Katan Banarasi silk",
  work: "Antique gold zari with woven floral jaal",
  color: "Sindoor red and heritage gold",
  blouse: "Comes with matching blouse piece",
  delivery: "Dispatch in 3 to 5 days",
  care: "Dry clean only",
  tone: "tone-red",
  collection: "Bridal Signatures"
};

const pages = {
  home: "#/",
  collections: "#/collections",
  about: "#/about",
  product: "#/product"
};

const apiBaseUrl = import.meta.env.PROD ? "" : "http://127.0.0.1:8787";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

const getPageFromHash = () => {
  const hash = window.location.hash || "#/";

  if (hash.startsWith("#/collections")) {
    return "collections";
  }

  if (hash.startsWith("#/about")) {
    return "about";
  }

  if (hash.startsWith("#/product")) {
    return "product";
  }

  return "home";
};

function HomePage({ selectedCollection, onSelectCollection }) {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-banner tone-red">
          <div className="hero-banner-copy">
            <p className="eyebrow">Luxury Banarasi Sarees</p>
            <h1>Timeless Banarasi elegance for weddings, festive moments, and heirloom wardrobes.</h1>
            <p className="lede">
              Zdhoorkya now has a cleaner premium storefront with dedicated pages for collections and brand storytelling, built for a more serious
              fashion-brand feel.
            </p>

            <div className="hero-actions">
              <a className="btn btn-solid" href={pages.collections}>Shop Collection</a>
              <a className="btn btn-outline" href={pages.about}>About Zdhoorkya</a>
            </div>
          </div>

            <div className="hero-banner-brand">
              <img className="hero-icon-logo" src="/zdhoorkya-icon-black.png" alt="Zdhoorkya icon" />
              <div className="hero-badge-card">
                <strong>Hero image guide</strong>
                <span>Use 2200 x 800 for desktop and 700 x 500 for mobile banner visuals.</span>
              </div>
            </div>
          </div>
        </section>

      <section className="section-block intro-strip" id="showcase">
        <article className="intro-card glass-card">
          <p className="eyebrow">Store direction</p>
          <h2>A richer, warmer, more couture look built around the Zdhoorkya identity.</h2>
        </article>

        <div className="feature-grid">
          {highlights.map((item) => (
            <article className="glass-card feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" id="collections-preview">
        <div className="section-heading">
          <p className="eyebrow">Featured collection</p>
          <h2>Three signature Banarasi moods with pricing and styling direction.</h2>
        </div>

        <div className="product-grid">
          <article className="product-card glass-card featured-home-product">
            <div className={`product-image ${sampleProduct.tone}`}>
              <span>Sample product</span>
            </div>

            <div className="product-copy">
              <div className="product-meta">
                <p className="price-name">Featured product</p>
                <span>{formatPrice(sampleProduct.price)}</span>
              </div>

              <h3 className="embedded-product-title">{sampleProduct.name}</h3>
              <p>{sampleProduct.shortDescription}</p>

              <ul>
                <li>{sampleProduct.fabric}</li>
                <li>{sampleProduct.work}</li>
              </ul>

              <a className="btn btn-solid" href={pages.product}>Open Product Page</a>
            </div>
          </article>

          {collections.map((item) => {
            const isSelected = selectedCollection.id === item.id;

            return (
              <article className={`product-card glass-card ${isSelected ? "selected" : ""}`} key={item.id}>
                <div className={`product-image ${item.tone}`}>
                  <span>Image slot</span>
                </div>

                <div className="product-copy">
                  <div className="product-meta">
                    <p className="price-name">{item.name}</p>
                    <span>{formatPrice(item.price)}</span>
                  </div>

                  <p>{item.note}</p>

                  <ul>
                    <li>{item.weave}</li>
                    <li>{item.mood}</li>
                  </ul>

                  <button className={`btn ${isSelected ? "btn-solid" : "btn-outline"}`} type="button" onClick={() => onSelectCollection(item)}>
                    {isSelected ? "Selected Highlight" : "Highlight This Saree"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="section-cta">
          <a className="btn btn-outline" href={pages.collections}>View All Collections</a>
          <a className="btn btn-solid" href={pages.product}>Open Sample Product</a>
        </div>
      </section>

      <section className="section-block split-section" id="craft">
        <article className="glass-card spotlight">
          <p className="eyebrow">Brand story</p>
          <h2>Sell the feeling of Banaras through the Zdhoorkya lens, not only the fabric specs.</h2>
          <p>
            This space is designed for your craftsmanship story, weaving heritage, blouse details, gifting notes, and why your sarees feel special
            enough to own for years.
          </p>
        </article>

        <article className="glass-card checklist">
          <p className="eyebrow">What this site can say</p>
          <ul>
            {rituals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-block feature-focus">
        <article className={`focus-card glass-card ${selectedCollection.tone}`}>
          <div className="focus-copy">
            <p className="eyebrow">Selected spotlight</p>
            <h2>{selectedCollection.name}</h2>
            <p>{selectedCollection.note}</p>
            <div className="focus-details">
              <div>
                <strong>{formatPrice(selectedCollection.price)}</strong>
                <span>premium collection price</span>
              </div>
              <div>
                <strong>{selectedCollection.weave}</strong>
                <span>signature weave note</span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function CollectionsPage() {
  return (
    <section className="page-shell">
      <div className="page-hero glass-card">
        <p className="eyebrow">Collections</p>
        <h1>Build each Zdhoorkya drop as its own collection story.</h1>
        <p>
          This page is ready for you to keep adding bridal edits, festive drops, tissue collections, and seasonal launches as the brand grows.
        </p>
      </div>

      <section className="collection-section">
        <div className="section-heading">
          <p className="eyebrow">Signature collections</p>
          <h2>All major Zdhoorkya collections in one clean desktop row.</h2>
        </div>

        <div className="collection-grid">
          {collections.map((item) => {
            const section = collectionSections.find((group) => group.slug === item.slug);

            return (
              <article className="collection-detail-card glass-card" key={item.id}>
                <div className={`collection-banner ${item.tone}`}>
                  <span>Collection image</span>
                </div>

                <div className="collection-detail-copy">
                  <div className="product-meta">
                    <p className="price-name">{item.name}</p>
                    <span>{formatPrice(item.price)}</span>
                  </div>

                  <h3>{section?.title}</h3>
                  <p>{item.note}</p>

                  <dl className="collection-meta-list">
                    <div>
                      <dt>Weave</dt>
                      <dd>{item.weave}</dd>
                    </div>
                    <div>
                      <dt>Mood</dt>
                      <dd>{item.mood}</dd>
                    </div>
                    <div>
                      <dt>Delivery</dt>
                      <dd>{item.delivery}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <article className="collection-feature-banner glass-card">
          <div className={`collection-feature-visual ${sampleProduct.tone}`}>
            <span>Sample product showcase</span>
          </div>

          <div className="collection-feature-copy">
            <p className="price-name">Ready product page</p>
            <h3>{sampleProduct.name}</h3>
            <p>{sampleProduct.shortDescription}</p>
            <div className="featured-product-actions">
              <a className="btn btn-solid" href={pages.product}>View Sample Product</a>
              <a className="btn btn-outline" href={pages.home}>Back to Home</a>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}

function ProductPage() {
  const [fallPico, setFallPico] = useState("yes");
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState("Choose your finish and continue to payment.");
  const [isLaunchingCheckout, setIsLaunchingCheckout] = useState(false);
  const productImages = ["Main product image", "Pallu detail", "Zari close-up"];
  const fallPicoCharge = fallPico === "yes" ? 50 : 0;
  const totalPrice = sampleProduct.price + fallPicoCharge;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.querySelector('script[data-razorpay-checkout="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.dataset.razorpayCheckout = "true";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const showPrevImage = () => {
    setMobileImageIndex((current) => (current === 0 ? productImages.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setMobileImageIndex((current) => (current === productImages.length - 1 ? 0 : current + 1));
  };

  const launchCheckout = async () => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!key) {
      setCheckoutStatus("Missing VITE_RAZORPAY_KEY_ID in frontend env.");
      return;
    }

    setIsLaunchingCheckout(true);
    setCheckoutStatus("Creating secure Razorpay order...");

    try {
      const orderResponse = await fetch(`${apiBaseUrl}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: sampleProduct.id,
          quantity: 1,
          fallPico
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Unable to create order.");
      }

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error("Razorpay checkout script failed to load.");
      }

      const checkout = new window.Razorpay({
        key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Zdhoorkya",
        description: sampleProduct.name,
        image: "/zdhoorkya-icon-black.png",
        theme: {
          color: "#7d1731"
        },
        notes: {
          fall_pico: fallPico
        },
        handler: async (response) => {
          const verifyResponse = await fetch(`${apiBaseUrl}/api/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.verified) {
            setCheckoutStatus("Payment verified successfully. This order is ready to be marked paid.");
            setIsLaunchingCheckout(false);
            return;
          }

          setCheckoutStatus("Payment completed but verification failed. Please recheck the server secret.");
          setIsLaunchingCheckout(false);
        },
        modal: {
          ondismiss: () => {
            setCheckoutStatus("Checkout closed. You can continue whenever ready.");
            setIsLaunchingCheckout(false);
          }
        }
      });

      checkout.on("payment.failed", () => {
        setCheckoutStatus("Payment failed or was interrupted. Please try again.");
        setIsLaunchingCheckout(false);
      });

      checkout.open();
      setCheckoutStatus("Razorpay checkout opened.");
    } catch (error) {
      setCheckoutStatus(error.message || "Unable to launch checkout.");
      setIsLaunchingCheckout(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="page-hero glass-card">
        <p className="eyebrow">Sample product page</p>
        <h1>Designing the product experience starts with one strong hero product.</h1>
        <p>
          This sample page is fully driven by one editable product object, so you can keep changing the product name, price, details, and image later
          without redesigning the layout.
        </p>
      </div>

      <section className="product-page-grid">
        <article className="product-gallery glass-card">
          <div className={`product-hero-image ${sampleProduct.tone}`}>
            <span>{productImages[mobileImageIndex]}</span>
          </div>

          <div className="mobile-gallery-controls">
            <button className="gallery-arrow" type="button" aria-label="Previous image" onClick={showPrevImage}>
              &#8249;
            </button>
            <div className="mobile-gallery-status">
              {mobileImageIndex + 1} / {productImages.length}
            </div>
            <button className="gallery-arrow" type="button" aria-label="Next image" onClick={showNextImage}>
              &#8250;
            </button>
          </div>

          <div className="product-thumb-row">
            {productImages.map((label, index) => (
              <button
                key={label}
                className={`product-thumb ${sampleProduct.tone} ${mobileImageIndex === index ? "active-thumb" : ""}`}
                type="button"
                onClick={() => setMobileImageIndex(index)}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="product-detail-panel glass-card">
          <p className="price-name">Zdhoorkya signature product</p>
          <h2>{sampleProduct.name}</h2>
          <div className="product-page-price">{formatPrice(totalPrice)}</div>
          <div className="product-extra-option">
            <strong>Fall & Pico</strong>
            <div className="option-toggle-row">
              <button
                className={`option-chip ${fallPico === "yes" ? "active" : ""}`}
                type="button"
                onClick={() => setFallPico("yes")}
              >
                Yes + Rs. 50
              </button>
              <button
                className={`option-chip ${fallPico === "no" ? "active" : ""}`}
                type="button"
                onClick={() => setFallPico("no")}
              >
                No
              </button>
            </div>
          </div>
          <p className="product-page-short">{sampleProduct.shortDescription}</p>
          <p>{sampleProduct.description}</p>

          <div className="product-detail-list">
            <div>
              <strong>Fabric</strong>
              <span>{sampleProduct.fabric}</span>
            </div>
            <div>
              <strong>Work</strong>
              <span>{sampleProduct.work}</span>
            </div>
            <div>
              <strong>Color</strong>
              <span>{sampleProduct.color}</span>
            </div>
            <div>
              <strong>Blouse</strong>
              <span>{sampleProduct.blouse}</span>
            </div>
            <div>
              <strong>Delivery</strong>
              <span>{sampleProduct.delivery}</span>
            </div>
            <div>
              <strong>Care</strong>
              <span>{sampleProduct.care}</span>
            </div>
          </div>

          <div className="product-page-actions">
            <button className="btn btn-solid" type="button" onClick={launchCheckout} disabled={isLaunchingCheckout}>
              {isLaunchingCheckout ? "Opening..." : "Pay with Razorpay"}
            </button>
            <button className="btn btn-outline" type="button">Add Inquiry CTA</button>
          </div>
          <div className="checkout-status-card">
            <strong>Checkout status</strong>
            <span>{checkoutStatus}</span>
          </div>
        </article>
      </section>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="page-shell">
      <div className="page-hero glass-card">
        <p className="eyebrow">About Zdhoorkya</p>
        <h1>A premium fashion brand built around elegance, storytelling, and Indian occasion wear.</h1>
        <p>
          Zdhoorkya is positioned as a refined label for Banarasi sarees and timeless wardrobe pieces, blending graceful presentation with a modern
          digital presence.
        </p>
      </div>

      <section className="about-grid">
        <article className="glass-card about-story">
          <p className="eyebrow">Our philosophy</p>
          <h2>Elegance every moment means making beauty feel wearable, memorable, and lasting.</h2>
          <p>
            The brand story can live here with your inspiration, your craftsmanship values, and the reason Zdhoorkya wants to create elevated fashion
            experiences for modern Indian customers.
          </p>
          <p>
            This page is also a strong place to talk about quality, styling support, gifting, occasion dressing, and why the label deserves trust.
          </p>
        </article>

        <article className="glass-card about-values">
          <p className="eyebrow">What sets us apart</p>
          <ul>
            <li>Banarasi storytelling framed like a premium brand, not a wholesale catalog.</li>
            <li>Occasion-first styling for bridal, festive, couture, and heirloom wardrobes.</li>
            <li>A digital experience designed to feel elegant, warm, and aspirational.</li>
          </ul>
        </article>
      </section>

      <section className="founders-row">
        <div className="section-heading">
          <p className="eyebrow">Founders</p>
          <h2>The people shaping Zdhoorkya.</h2>
        </div>

        <div className="founders-grid">
          {founders.map((founder) => (
            <article className="founder-card glass-card" key={founder.name}>
              <div className="founder-avatar">
                <span>{founder.name.split(" ").map((word) => word[0]).join("")}</span>
              </div>
              <p className="price-name">{founder.role}</p>
              <h3>{founder.name}</h3>
              <p>{founder.text}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function App() {
  const defaultCollection = useMemo(() => collections[0], []);
  const [selectedCollection, setSelectedCollection] = useState(defaultCollection);
  const [page, setPage] = useState(() => getPageFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setPage(getPageFromHash());
      setMobileMenuOpen(false);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="topbar">
        <a className="brand" href={pages.home} aria-label="Zdhoorkya home">
          <img className="brand-full-logo" src="/zdhoorkya-full-black.png" alt="Zdhoorkya logo" />
          <span className="brand-subtitle">Elegance Every Moment</span>
        </a>

        <button
          className={`mobile-menu-button ${mobileMenuOpen ? "open" : ""}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${mobileMenuOpen ? "open" : ""}`}>
          <a className={page === "home" ? "active-link" : ""} href={pages.home}>Home</a>
          <a className={page === "collections" ? "active-link" : ""} href={pages.collections}>Collections</a>
          <a className={page === "product" ? "active-link" : ""} href={pages.product}>Product</a>
          <a className={page === "about" ? "active-link" : ""} href={pages.about}>About</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      <main>
        {page === "home" ? <HomePage selectedCollection={selectedCollection} onSelectCollection={setSelectedCollection} /> : null}
        {page === "collections" ? <CollectionsPage /> : null}
        {page === "product" ? <ProductPage /> : null}
        {page === "about" ? <AboutPage /> : null}

        <section className="contact-block glass-card" id="contact">
          <div>
            <p className="eyebrow">Contact and inquiry</p>
            <h2>Invite bridal shoppers, stylists, and resellers into the conversation.</h2>
            <p>
              This section can later become WhatsApp ordering, custom consultation, reseller contact, or a proper inquiry form. For now it helps the
              page feel complete and premium.
            </p>
          </div>

          <form className="contact-form">
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Email address" />
            <textarea rows="5" placeholder="Tell us which saree, occasion, or color palette you want" />
            <button className="btn btn-solid" type="button">Send Inquiry</button>
          </form>
        </section>

        {page === "home" ? (
          <section className="section-block" id="reviews">
            <div className="section-heading">
              <p className="eyebrow">Brand trust</p>
              <h2>Luxury visuals still need reassurance and credibility.</h2>
            </div>

            <div className="testimonial-grid">
              {reviews.map((item) => (
                <article className="glass-card testimonial-card" key={item.name}>
                  <p className="quote">"{item.quote}"</p>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img className="footer-logo" src="/zdhoorkya-full-black.png" alt="Zdhoorkya logo" />
          <p>
            Zdhoorkya is designed as a premium Indian fashion storefront with a refined digital experience for Banarasi collections, occasion wear,
            and elevated product storytelling.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <a href={pages.home}>Home</a>
            <a href={pages.collections}>Collections</a>
            <a href={pages.product}>Product</a>
            <a href={pages.about}>About</a>
          </div>

          <div>
            <strong>Brand Notes</strong>
            <span>Banarasi sarees</span>
            <span>Bridal signatures</span>
            <span>Festive classics</span>
            <span>Elegance Every Moment</span>
          </div>

          <div>
            <strong>Contact</strong>
            <span>support@zdhoorkya.com</span>
            <span>+91 90000 00000</span>
            <span>India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
