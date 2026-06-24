Plan cải tiến
1. Animations (Fluid / Material)
Ripple effect khi click vào film card
Spring transitions (cubic-bezier(0.34, 1.56, 0.64, 1)) thay ease-in-out flat
Stagger slide-up khi list phim render (dùng CSS animation-delay)
Morphing spinner thay loading dots/line hiện tại
Scroll-into-view fade cho các section trên HomePage (Intersection Observer)
Header scroll shrink — header thu nhỏ nhẹ khi scroll xuống
2. Performance
Native lazy loading cho tất cả <img> (loading="lazy") + IntersectionObserver fallback
Skeleton UI thay LoadingComponent (đẹp hơn, giảm layout shift) — bonus vì nó đi kèm tự nhiên với lazy load
3. Không thay đổi
Logic data fetching, routing, context — giữ nguyên
Component structure — chỉ sửa SCSS + nhỏ trong JSX
Bắt đầu implement nhé?

cung cấp plan chi tiết và các bước thực hiện cho tớ là đc không cần code đâu
Plan chi tiết cải tiến Cinema-FE
PHASE 1 — Animations (Fluid / Material)
Mục tiêu: Thay toàn bộ transition flat bằng spring/elastic, thêm hiệu ứng có chiều sâu

Bước 1.1 — Global transition variables (mainStyle.scss)
Định nghĩa CSS variables dùng chung thay vì hardcode từng file:


--transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--transition-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94)
--transition-quick:  cubic-bezier(0.4, 0, 0.2, 1)
Từ đó tất cả component dùng variable thay vì ease-in-out / linear.

Bước 1.2 — Film card hover (FilmItemComponent.scss + FilmSliderItem.scss)
Hiện tại: scale(1.2) thô, all 0.5s ease-in-out

Nâng cấp lên:

Card lift lên: translateY(-6px) scale(1.04) — nhẹ hơn, tinh tế hơn
Box shadow xuất hiện theo cùng transition tạo cảm giác nổi lên
Overlay gradient từ dưới lên thay vì fade toàn phần
Timing: 0.35s var(--transition-spring)
Play icon: scale từ 0.8 → 1 + spring thay vì opacity flat
Bước 1.3 — Ripple effect khi click card (FilmItemComponent.js + scss)
Thêm JS handler onClick tạo ripple element động:

Tính toán vị trí click relative với card
Append <span class="ripple"> với position đó
CSS: border-radius: 50%, scale 0 → 3, opacity 0.3 → 0, duration 0.6s
Tự remove sau khi animation xong (animationend event)
Bước 1.4 — Stagger animation cho film list (FilmSliderItem.scss)
Khi list render, các item xuất hiện lần lượt thay vì cùng lúc:

Dùng CSS animation-delay: calc(var(--index) * 60ms)
Keyframe slideUp: translateY(20px) opacity:0 → translateY(0) opacity:1
Cần truyền style={{ '--index': index }} từ ListFilmSlider.js
Bước 1.5 — Morphing spinner (LoadingComponent.scss)
Thay loader line + dot hiện tại bằng morphing spinner:

Single element, border-radius thay đổi từ 50% → 30% → 50%
Kết hợp rotate + scale tạo cảm giác "thở"
Màu dùng var(--film_highlight_color) theo theme
Bước 1.6 — Header scroll shrink (DefaultLayout.js + scss)
Thêm useEffect + scroll event listener trong DefaultLayout.js
Khi scrollY > 60: thêm class .scrolled vào header
CSS: .scrolled giảm padding, font-size logo nhỏ lại, backdrop-filter: blur(12px) tăng lên
Transition: 0.3s var(--transition-smooth)
Bước 1.7 — Scroll-into-view fade sections (HomePagePCTablet.js + scss)
Dùng IntersectionObserver để animate các section khi scroll vào viewport:

Mỗi ListFilmComponent section bắt đầu ở opacity:0, translateY(30px)
Khi isIntersecting: true → thêm class .visible → animate vào
Threshold: 0.1 (chỉ cần 10% visible là trigger)
Stagger giữa các section: transition-delay theo index
PHASE 2 — Performance (Lazy Load Images)
Mục tiêu: Tất cả poster phim chỉ load khi user scroll đến, giảm initial load đáng kể

Bước 2.1 — Native lazy loading (FilmItemComponent.js, FilmSliderItem.js, SliderItem.js)
Quick win không cần thư viện:

Thêm loading="lazy" vào tất cả <img> tag
Thêm decoding="async" để browser decode ảnh không block main thread
Thêm fetchpriority="high" chỉ cho ảnh slider đầu tiên (above the fold)
Lưu ý: 3 file cần sửa vì đang dùng background-image CSS thay <img> — cần chuyển sang <img> tag mới dùng được native lazy load.

Bước 2.2 — IntersectionObserver cho background-image cards (custom hook)
Với các card dùng background-image (không chuyển sang <img>), tạo hook useImageLazyLoad.js:

Nhận ref và imageUrl
Dùng IntersectionObserver, khi card vào viewport mới set backgroundImage
Ban đầu: background là var(--skeleton-color) (placeholder)
Sau khi load xong: fade in ảnh thật với opacity: 0 → 1
Bước 2.3 — Skeleton UI thay LoadingComponent (bonus đi kèm tự nhiên)
Trong lúc chờ data/ảnh load:

Tạo SkeletonFilmItem.js — layout giống FilmSliderItem nhưng các block là màu gradient shimmer
ListFilmSlider.js render skeleton items khi data.length < 5 thay vì <LoadingComponent>
Shimmer animation: background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%) + background-size: 200% animate từ trái sang phải
Bước 2.4 — Preconnect CDN (public/index.html)
Không cần code, chỉ thêm vào <head>:


<link rel="preconnect" href="https://img.phimapi.com">
<link rel="dns-prefetch" href="https://img.phimapi.com">
Browser sẽ resolve DNS + mở TCP connection sẵn trước khi request ảnh đầu tiên.

PHASE 3 — Polish & Consistency
Bước 3.1 — Đồng nhất timing toàn dự án
Quét và replace toàn bộ:

transition: all 0.5s ease-in-out → transition: transform 0.35s var(--transition-spring), box-shadow 0.35s var(--transition-smooth)
transition: all 0.3s linear → transition: ... 0.25s var(--transition-quick)
Tránh dùng transition: all (animate những property không cần, tốn CPU)
Bước 3.2 — Reduced motion support (mainStyle.scss)
Thêm @media (prefers-reduced-motion: reduce) để disable/giảm animation cho người dùng có cài đặt accessibility:


@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
Thứ tự thực hiện đề xuất
Thứ tự	Bước	Lý do ưu tiên
1	1.1 — Global variables	Foundation cho mọi thứ sau
2	2.1 — Native lazy load	Impact lớn, effort thấp nhất
3	2.4 — Preconnect CDN	5 phút, gain ngay lập tức
4	1.2 — Card hover nâng cấp	Visible nhất với user
5	1.5 — Morphing spinner	Thay thế loading xấu nhất hiện tại
6	2.2 + 2.3 — Lazy load BG + Skeleton	Cần làm cùng nhau
7	1.3 — Ripple click	Tactile feedback đẹp
8	1.4 — Stagger list	Wow effect khi render
9	1.6 — Header scroll	Header pro hơn
10	1.7 — Scroll fade sections	Finisher cho homepage
11	3.1 + 3.2 — Polish & a11y