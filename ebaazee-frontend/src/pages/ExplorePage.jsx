// src/pages/ExplorePage.jsx
import React, { useState, useRef, useEffect } from "react";
import exploreData from "../data/ExploreData.json";
import listingData from "../data/listings.json";
import filterOptions from "../data/filters.json";
import styles from "../css/ExplorePage.module.css";
import listStyles from "../css/ListingSection.module.css";
import walletData from "../data/UserProfile.json";

export default function ExplorePage() {
  const { carouselItems, categories } = exploreData;
  const [searchText, setSearchText] = useState("");
  const listings = listingData.listings;
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value);

  // ── Modal state ────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [feedback, setFeedback] = useState("");

  const openBidModal = (product) => {
    setSelectedProduct(product);
    setBidAmount("");
    setFeedback("");
    setModalOpen(true);
  };

  const closeBidModal = () => setModalOpen(false);

  const placeBid = () => {
    const amt = parseFloat(bidAmount);
    if (isNaN(amt) || amt <= selectedProduct.currentBid) {
      setFeedback("⚠️ The Bid amount must be greater than the current bid.");
    } else if (amt < selectedProduct.minBid || amt > selectedProduct.maxBid) {
      setFeedback(
        `⚠️ Bid must be between $${selectedProduct.minBid} and $${selectedProduct.maxBid}.`
      );
    } else {
      setFeedback(
        "✅ Your bid was placed successfully! Head to My Auctions to check its status."
      );
      // Placeholder: submit to backend/context
    }
  };

  // ── Main carousel state & ref ─────────────────────────
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);
  const didMountMain = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    const slide = container?.children[current];
    if (!didMountMain.current) {
      // skip on first render
      didMountMain.current = true;
      return;
    }
    if (container && slide) {
      container.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  }, [current]);
  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () =>
    setCurrent((i) => Math.min(carouselItems.length - 1, i + 1));

  // ── Top‑categories carousel state & ref ───────────────
  const [catIndex, setCatIndex] = useState(0);
  const catRef = useRef(null);
  const didMountCat = useRef(false);

  const scrollToCategory = (i) => {
    const container = catRef.current;
    const node = container?.children[i];

    if (!didMountCat.current) {
      // skip on first call
      didMountCat.current = true;
      return;
    }

    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };
  const prevCat = () =>
    setCatIndex((i) => {
      const ni = Math.max(0, i - 1);
      scrollToCategory(ni);
      return ni;
    });
  const nextCat = () =>
    setCatIndex((i) => {
      const ni = Math.min(categories.length - 1, i + 1);
      scrollToCategory(ni);
      return ni;
    });

  // Listing‑view state
  // const [sales, setSales]         = useState('Active');
  // const [country, setCountry]     = useState('Spain');
  // const [period, setPeriod]       = useState('today');
  // const [condition, setCondition] = useState('new');
  // const [priceMax, setPriceMax]   = useState(10000);
  const [sales, setSales] = useState(filterOptions.sales[0].value);
  const total = listings.length;

  return (
    <div className={styles.root}>
      {/* 1. Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.search}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Products"
            className={styles.searchInput}
          />
        </div>
        <div className={styles.wallet}>${walletData.wallet}</div>
      </div>

      {/* 2. Main Carousel */}
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselScroll} ref={scrollRef}>
          {carouselItems.map((item) => (
            <div key={item.id} className={styles.carouselSlide}>
              <div className={styles.carouselContent}>
                <h2 className={styles.carouselTitle}>{item.title}</h2>
                <p className={styles.carouselText}>{item.text}</p>
                <button className={styles.carouselButton}>
                  {item.buttonText}
                </button>
              </div>
              <div className={styles.imagesStack}>
                <div className={styles.imagesStackItem} />
                <div className={styles.imagesStackItem} />
                <div className={styles.imagesStackItem} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.carouselArrows}>
          <button
            onClick={prev}
            className={styles.arrowButton}
            disabled={current === 0}
          >
            ‹
          </button>
          <button
            onClick={next}
            className={styles.arrowButton}
            disabled={current === carouselItems.length - 1}
          >
            ›
          </button>
        </div>
        <div className={styles.carouselDots}>
          {carouselItems.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={i === current ? styles.dotActive : styles.dot}
            />
          ))}
        </div>
      </div>

      {/* 3. Top Categories Carousel */}
      <section className={styles.categorySection}>
        <h2 className={styles.categoryHeading}>Top Categories</h2>
        <div className={styles.categoryCarouselWrapper}>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevCat();
            }}
            disabled={catIndex === 0}
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          >
            ‹
          </button>
          <div className={styles.categoryCarousel} ref={catRef}>
            {categories.map((cat) => (
              <div
                key={cat.value}
                className={`${styles.categoryCard} ${
                  activeCategory === cat.value ? styles.active : ""
                }`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <div className={styles.categoryImageWrapper}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className={styles.categoryImage}
                  />
                </div>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextCat();
            }}
            disabled={catIndex === categories.length - 1}
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
          >
            ›
          </button>
        </div>
      </section>

      {/* 4. Listing Section */}
      <div className={listStyles.listingWrapper}>
        {/* Sidebar Filters */}
        <aside className={listStyles.sidebar}>
          {/* Status */}
          <div className={listStyles.filterGroup}>
            <label className={listStyles.filterTitle}>Status</label>
            <select
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              className={listStyles.filterSelect}
            >
              {filterOptions.sales.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className={listStyles.filterGroup}>
            <label className={listStyles.filterTitle}>Category</label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={listStyles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply Button */}
          <button className={listStyles.applyButton}>Apply</button>
        </aside>

        {/* Results Grid */}
        <section className={listStyles.listingContent}>
          <div className={listStyles.listingHeader}>
            <div>
              Showing 1–{total} of {total} Results
            </div>
          </div>
          <div className={listStyles.grid}>
            {listings.map((item) => (
              <div key={item.id} className={listStyles.card}>
                <div
                  className={listStyles.cardImage}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div
                  className={
                    item.status === "active"
                      ? listStyles.badgeLive
                      : listStyles.badgeUpcoming
                  }
                >
                  {item.status.toUpperCase()}
                </div>
                <div className={listStyles.countdown}>
                  {["Days", "Hours", "Min", "Sec"].map((label) => (
                    <div key={label} className={styles.timeSegment}>
                      <span>00</span>
                      <small>{label}</small>
                    </div>
                  ))}
                </div>
                <h3 className={listStyles.cardTitle}>{item.title}</h3>
                <div className={listStyles.currentBid}>
                  Current Bid at:{" "}
                  <strong>${item.currentBid.toLocaleString()}</strong>
                </div>
                <button
                  className={listStyles.bidButton}
                  onClick={() => openBidModal(item)}
                  disabled={item.status !== "Active"}
                >
                  {item.status === "Active" ? "Bid Now" : "Notify Me"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Bid Modal ────────────────────────────────────────── */}
      {modalOpen &&
        selectedProduct && ( // ⬅ NEW: modal conditional
          <div className={styles.modalOverlay} onClick={closeBidModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>Place a Bid</h2>
              <p>
                <strong>Item:</strong> {selectedProduct.title}
              </p>
              <p>
                <strong>Current Bid:</strong> ${selectedProduct.currentBid}
              </p>
              <p>
                <strong>Allowed Range:</strong> ${selectedProduct.minBid} – $
                {selectedProduct.maxBid}
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="bidAmount">Your Bid</label>
                <input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter higher than current bid"
                />
              </div>

              {feedback && ( // ⬅ NEW: feedback message
                <div
                  className={
                    feedback.startsWith("✅")
                      ? styles.successMsg
                      : styles.errorMsg
                  }
                >
                  {feedback}
                </div>
              )}

              <div className={styles.modalActions}>
                <button onClick={placeBid} className="btn">
                  Place Bid
                </button>
                <button onClick={closeBidModal} className="btn outlined">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
