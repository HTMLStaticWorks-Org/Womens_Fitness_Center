# VALÉRA — Women's Strength & Wellness Atelier

A responsive, editorial boutique women's fitness center HTML5 website template built with **Bootstrap 5.3**, custom **CSS3 design tokens**, **Vanilla JavaScript**, and **GSAP 3.12**. Designed for boutique women's gyms, strength studios, reformer Pilates studios, personal training ateliers, and holistic wellness centers.

---

## Pages Included (9 Complete HTML Pages)

1. **`index.html` (Home 1)** — Primary cinematic homepage with full-bleed studio photography, featured training pillars, weekly class schedule preview, trainer profiles, member philosophy, testimonials, and membership CTA.
2. **`home-2.html` (Home 2)** — Alternative editorial lifestyle homepage accessible via the **Home** navbar dropdown, featuring a distinct split composition, editorial program index, member transformation stories, coaching roster showcase, and studio notes.
3. **`about.html` (About)** — Studio mission, core training philosophy, inclusive coaching standards, and community culture with consistent hero height.
4. **`classes.html` (Classes)** — Interactive category filtering (**All**, **Strength & Conditioning**, **Cardio & Movement**, **Mind & Body**), editorial featured sessions, duration & level badges, weekly timetable preview, and class enquiry modal.
5. **`trainers.html` (Trainers)** — Dedicated coaching roster highlighting strength coaches, personal trainers, yoga teachers, Pilates instructors, and group conditioning specialists with certifications and philosophies.
6. **`contact.html` (Contact)** — Studio address, opening hours, WhatsApp & phone links, embedded location block, and interactive membership enquiry form with frontend validation.
7. **`dashboard.html` (Member Dashboard)** — Full-height left sidebar workspace with a **Logout** button, overview KPIs, interactive class booking toggles, daily workout plan tabs, nutrition & diet schedule tabs, and membership renewal selector (frontend demo state).
8. **`login.html` (Member Login)** — Distraction-free centered card without navbar or footer, top-centered `VALÉRA` brand icon & wordmark, stacked input rows, **Remember me** + **Forgot password?** aligned on the same row, password visibility toggle, and Google & Apple social buttons.
9. **`signup.html` (Member Sign Up)** — Matching centered registration card without navbar or footer, stacked fields (full name, email, mobile number, password, confirm password, fitness goal, preferred program, terms), password visibility toggles, and Google & Apple social buttons.

---

## Key Features

- **Consistent Brand Identity & Favicon**: Custom SVG brand mark (`assets/images/favicon.svg`) beside the `VALÉRA` wordmark across all navbars, footers, authentication cards, and browser tabs.
- **Sticky Responsive Navbar**: Ordered navigation (**Home** dropdown -> Home 1 / Home 2, **About**, **Classes**, **Trainers**, **Contact**, **Dashboard**), **RTL** direction toggle (`RTL` text only), **Light/Dark Theme** toggle, and **Sign Up** CTA button.
- **Light & Dark Theme Support**: Persistent `localStorage` preference (`valera_theme_preference`), featuring a crisp white footer background (`#FFFFFF`) in Light Mode and refined charcoal/plum surfaces (`#141113`) in Dark Mode.
- **RTL Layout Support**: Persistent `localStorage` direction state (`valera_dir_preference`) toggling `dir="rtl"` seamlessly across navigation, typography alignments, and dashboard layouts.
- **Uniform Non-Home Page Heroes**: `about.html`, `classes.html`, `trainers.html`, and `contact.html` share the uniform `.page-hero-valera` height and spacing system.
- **Curated Local Photography (`assets/images/`)**: 26 local high-resolution women's fitness, strength training, reformer Pilates, yoga, cycling, and coaching photographs—eliminating external hotlink rate limits.

---

## Project Structure

```text
Womens_Fitness_Center/
├── index.html
├── home-2.html
├── about.html
├── classes.html
├── trainers.html
├── contact.html
├── dashboard.html
├── login.html
├── signup.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── favicon.svg
        └── *.jpg (26 local women's fitness photographs)
```

---

## Notes

- All authentication, enquiry, class booking, and membership renewal forms operate strictly as frontend interactive UI demonstrations without live backend persistence.
