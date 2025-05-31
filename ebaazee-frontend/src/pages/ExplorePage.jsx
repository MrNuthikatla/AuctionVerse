import React, { useState, useRef, useEffect } from "react";
import filterOptions from "../data/filters.json";
import styles from "../css/ExplorePage.module.css";
import listStyles from "../css/ListingSection.module.css";
import walletData from "../data/UserProfile.json";
import { useSection } from './context/SectionContext';

// Countdown timer for product endTime
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, end - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      min: Math.floor((diff / (1000 * 60)) % 60),
      sec: Math.floor((diff / 1000) % 60),
      finished: diff === 0,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [endTime]);

  return (
      <>
        <div className={styles.timeSegment}>
          <span>{String(timeLeft.days).padStart(2, "0")}</span>
          <small>Days</small>
        </div>
        <div className={styles.timeSegment}>
          <span>{String(timeLeft.hours).padStart(2, "0")}</span>
          <small>Hours</small>
        </div>
        <div className={styles.timeSegment}>
          <span>{String(timeLeft.min).padStart(2, "0")}</span>
          <small>Min</small>
        </div>
        <div className={styles.timeSegment}>
          <span>{String(timeLeft.sec).padStart(2, "0")}</span>
          <small>Sec</small>
        </div>
      </>
  );
}

export default function ExplorePage() {
  // Carousel static data
  const [carouselItems] = useState([
    {
      id: 1,
      title: "Welcome to Auction",
      text: "Bid on exciting products!",
      buttonText: "Explore Now",
    },
    {
      id: 2,
      title: "Exclusive Deals",
      text: "Grab the best offers",
      buttonText: "Shop Deals",
    },
  ]);

  // Categories and listings from backend
  const [categories, setCategories] = useState([
    { value: "ALL", label: "All", image: "/images/default.png" },
  ]);
  const [listings, setListings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sales, setSales] = useState("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [bidPlaced, setBidPlaced] = useState(false);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);
  const didMountMain = useRef(false);

  // Category carousel state
  const [catIndex, setCatIndex] = useState(0);
  const catRef = useRef(null);
  const didMountCat = useRef(false);

  //Context state
  const { setSection } = useSection();

  // Fetch categories from backend and add "All"
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:9090/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          const mapped = data.map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
            image:
                cat === "ELECTRONICS"
                    ? "/images/electronics.png"
                    : cat === "FASHION"
                        ? "/images/fashion.png"
                        : "/images/default.png",
          }));
          setCategories([
            { value: "ALL", label: "All", image: "/images/default.png" },
            ...mapped,
          ]);
          setActiveCategory("ALL");
        })
        .catch(console.error);
  }, []);

  // Fetch products, do not filter by category if "All" is selected
  useEffect(() => {
    const token = localStorage.getItem("token");
    const url =
        activeCategory && activeCategory !== "ALL"
            ? `http://localhost:9090/api/products?category=${activeCategory}`
            : `http://localhost:9090/api/products`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          const mapped = data.map((item) => ({
            ...item,
            productId: item.productId || item.id,
            productName: item.productName || item.name || "Unnamed",
          }));
          setListings(mapped);
        })
        .catch(console.error);
  }, [activeCategory]);

  // Carousel scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    const slide = container?.children[current];
    if (!didMountMain.current) {
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

  // Category carousel scroll
  const scrollToCategory = (i) => {
    const container = catRef.current;
    const node = container?.children[i];
    if (!didMountCat.current) {
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

  // Modal functions
  const openBidModal = (product) => {
    setSelectedProduct(product);
    setBidAmount("");
    setFeedback("");
    setModalOpen(true);
    setBidPlaced(false);
  };
  const closeBidModal = () => setModalOpen(false);

  // Place bid API integration
  const placeBid = async () => {
    if (!selectedProduct) return;
    const amt = parseFloat(bidAmount);
    if (isNaN(amt) || amt <= selectedProduct.currentBid) {
      setFeedback("⚠️ The Bid amount must be greater than the current bid.");
      return;
    }
    if (amt < selectedProduct.minBid || amt > selectedProduct.maxBid) {
      setFeedback(
          `⚠️ Bid must be between $${selectedProduct.minBid} and $${selectedProduct.maxBid}.`
      );
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
          `http://localhost:9090/api/bids/place/${selectedProduct.productId}?bidAmount=${amt}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      const text = await res.text();
      if (res.ok) {
        setFeedback(
            "✅ Your bid was placed successfully! Head to My Auctions to check its status."
        );
        setBidPlaced(true);
      } else {
        setFeedback(`⚠️ ${text}`);
      }
    } catch (e) {
      setFeedback("⚠️ Failed to place bid.");
    }
  };

  //Context logic
  const handleCheckout = () => {
    closeBidModal();
    setSection('payment');
  }

  // Status logic
  function getStatus(product) {
    if (product.sold) return "sold";
    if (product.frozen) return "frozen";
    if (product.endTime && new Date(product.endTime) < new Date()) return "frozen";
    return "active";
  }

  // Filter listings by status and category and search
  const filteredListings = listings.filter((item) => {
    const statusMatch =
        sales.toLowerCase() === "all" ? true : getStatus(item) === sales.toLowerCase();
    const categoryMatch =
        activeCategory === "ALL" ? true : item.category === activeCategory;
    const searchMatch =
        !searchText ||
        item.productName.toLowerCase().includes(searchText.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  const resetFilters = () => {
    setActiveCategory(categories[0]?.value);
    setSales(filterOptions.sales[0].value);
  };

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
                <option value="all">All</option>
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

            {/* Reset Button */}
            <button className={listStyles.applyButton} onClick={resetFilters}>
              Reset
            </button>

          </aside>

          {/* Results Grid */}
          <section className={listStyles.listingContent}>
            <div className={listStyles.listingHeader}>
              <div>
                Showing 1–{filteredListings.length} of {filteredListings.length} Results
              </div>
            </div>
            <div className={listStyles.grid}>
              {filteredListings.map((item) => (
                  <div key={item.productId} className={listStyles.card}>
                    <div
                        className={listStyles.cardImage}
                        style={{
                          backgroundImage: `url(${
                              categories.find((c) => c.value === item.category)?.image ||
                              "/images/default.png"
                          })`,
                        }}
                    />
                    <div
                        className={
                          getStatus(item) === "active"
                              ? listStyles.badgeLive
                              : getStatus(item) === "sold"
                                  ? listStyles.badgeUpcoming
                                  : listStyles.badgeUpcoming
                        }
                    >
                      {getStatus(item).toUpperCase()}
                    </div>
                    <div className={listStyles.countdown}>
                      {item.endTime ? (
                          <CountdownTimer endTime={item.endTime} />
                      ) : (
                          ["Days", "Hours", "Min", "Sec"].map((label) => (
                              <div key={label} className={styles.timeSegment}>
                                <span>00</span>
                                <small>{label}</small>
                              </div>
                          ))
                      )}
                    </div>
                    <h3 className={listStyles.cardTitle}>{item.productName}</h3>
                    <div className={listStyles.currentBid}>
                      Current Bid at: <strong>${item.currentBid}</strong>
                    </div>
                    <button
                        className={listStyles.bidButton}
                        onClick={() => openBidModal(item)}
                        disabled={getStatus(item) !== "active"}
                    >
                      {getStatus(item) === "active" ? "Bid Now" : "Notify Me"}
                    </button>
                  </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bid Modal */}
        {modalOpen && selectedProduct && (
            <div className={styles.modalOverlay} onClick={closeBidModal}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Place a Bid</h2>
                <p>
                  <strong>Item:</strong> {selectedProduct.productName}
                </p>
                 <p className={styles.modalDescription}>
                  <strong>Description:</strong>{selectedProduct.description || "No description available."}
                </p>
                <p>
                  <strong>Current Bid:</strong> ${selectedProduct.currentBid}
                </p>
                <p>
                  <strong>Average Bid:</strong> ${selectedProduct.averageBid ?? '—'}
                </p>
                <p>
                  <strong>Bidders:</strong> {selectedProduct.bidderCount ?? 0}
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
                      disabled={bidPlaced}
                  />
                </div>

                {feedback && (
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
                  {!bidPlaced ? (                                
                    <button onClick={placeBid} className="btn">
                      Place Bid
                    </button>
                  ) : (                                          
                    <button
                      onClick={handleCheckout}
                      className="btn"
                    >
                      Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
