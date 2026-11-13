# Mangal Mandap - Royal Digital Wedding Invitation 🪔✨

Yeh exact replica hai **Wedvo ke "Mangal Mandap"** wedding invitation template ka (`https://wedvo.in/preview/mangal-mandap`).
Isme saari animations, 3D envelope opening, background music, interactive gold scratch card, marigold garland vine, photo collage, aur RSVP form completely functional aur local assets ke saath taiyyar hai.

---

## 🌟 Features Included

1. **3D Royal Envelope Entrance (शाही लिफाफा)**
   - Maroon & gold foil texture wala ornate envelope.
   - Golden Wax Seal medallion (`R&P` monogram) jo tap karne par 3D perspective me open hota hai.
   - Ganesh Vandana shloka aur golden bloom light animation.
2. **Background Shehnai / Wedding Music (शाही बैकग्राउंड संगीत)**
   - High-quality royal instrumental background music (`assets/bgm.mp3`).
   - Floating audio control button (bottom-left) with animated soundwave rings aur mute/unmute toggle.
   - First interaction / tap par smooth fade-in ke sath play hota hai.
3. **Falling Rose Petals Particle Engine (गुलाब की पंखुड़ियाँ)**
   - Fullscreen HTML5 canvas par 3D tumbling rose petals (maroon, blush, gold).
   - Scratch card reveal aur RSVP submit karne par celebratory explosive petal burst.
4. **Interactive Gold Foil Scratch Card (स्क्रैच कार्ड)**
   - Realistic gold foil metallic gradient aur hairline brush canvas.
   - Pointer / mouse / touch se scratch karne par real-time scratching sound effect.
   - Scratch reveal hote hi chimes audio, haptic vibration, confetti shower aur live "Days to Go" countdown timer.
5. **Scroll-Driven "Genda Ki Ladi" (गेंदे के फूलों की लड़)**
   - Wedding events (Satyanarayan Katha, Haldi, Mehendi, Shubh Vivah) ke sath scroll karne par ek golden metallic vine grow hoti hai.
   - Har event card ke pas marigold flower pop hota hai aur function card golden glow ke sath activate hota hai.
   - Har event ke liye date, time, venue aur 1-click **Open in Google Maps** button.
6. **Moments Photo Gallery (फोटो गैलरी)**
   - Vintage album prints with gold corner mounts aur rose sprigs.
   - Photos par click karne par full-screen HD lightbox popup open hota hai.
7. **Interactive RSVP Modal Dialog**
   - Guest attendance toggle ("Joyfully attending" / "Sending blessings").
   - Guest counter (+ / - stepper).
   - Blessings & wishes message box with celebratory petal burst.
8. **Royal Farewell Footer**
   - Animated swinging royal chandelier (झूमर).
   - Family blessings list with automatic orphan dot formatting.
   - Tap-to-call phone buttons (Rajesh Sharma & Anil Gupta).
   - Vintage baroque oval gold frame with roses and couple portrait.
   - "॥ शुभमस्तु ॥" traditional closing.

---

## 🚀 How to Run (कैसे चलाएं)

### Option 1: Direct Browser Open
Aap seedhe `c:\Users\akash\Documents\card\index.html` file par double-click karke kisi bhi browser (Chrome, Edge, Firefox, Safari) me open kar sakte hain.

### Option 2: Local Web Server (Recommended)
Kisi bhi modern browser me audio aur video smoothly load karne ke liye local web server se run karna best hota hai:

- **Using Python**:
  ```bash
  python -m http.server 8000
  ```
  Fir browser me open karein: `http://localhost:8000`

- **Using Node / NPX**:
  ```bash
  npx serve
  ```

- **Using VS Code**:
  VS Code me folder open karke **Live Server** extension se "Go Live" par click karein.

---

## ✏️ How to Customize (डिटेल्स कैसे बदलें)

Aapko code me ghusne ki zarurat nahi hai! Saari details **`wv-sample.js`** file me centralized hain.

Aap `wv-sample.js` ko open karke apni pasand ke hisaab se update kar sakte hain:

### 1. Dulha & Dulhan ke Naam (Groom & Bride)
```javascript
"groom": "Rohan",
"bride": "Priya",
"order": "groom", // "groom" ya "bride" (jiska naam pehle dikhana ho)
```

### 2. Shaadi ki Tareekh (Date & Countdown)
```javascript
"iso": "2027-12-12T19:00:00+05:30", // YYYY-MM-DDTHH:mm:ss format
"city": "Jaipur, Rajasthan",
```

### 3. Events & Itinerary (Functions)
```javascript
"events": [
  {
    "name": "Satyanarayan Katha",
    "date": "Friday, 10 December 2027",
    "time": "11:00 AM",
    "venue": "Hotel Grand Palace",
    "addr": "Civil Lines, Jaipur",
    "map": "" // Google Maps URL (optional, agar blank ho toh auto-search karega)
  },
  {
    "name": "Haldi",
    "date": "Saturday, 11 December 2027",
    "time": "11:00 AM onwards",
    "venue": "The Garden House",
    "addr": "MG Road, Jaipur",
    "map": ""
  }
]
```

### 4. Parivaar & Phone Numbers (Contacts)
```javascript
"gParents": "Mrs. Sunita & Mr. Rajesh Sharma",
"bParents": "Mrs. Neeta & Mr. Anil Gupta",
"family": "Neha & Amit Sharma · Rahul Sharma\nKavita & Suresh Sharma · Meena & Deepak Gupta",
"p1n": "Rajesh Sharma",
"p1": "98765 00000",
"p2n": "Anil Gupta",
"p2": "98765 11111",
```

### 5. Photos & Music (तस्वीरें और संगीत)
- Photos ko `assets/` folder me rakh kar `wv-sample.js` me path update karein:
  - `"photo": "./assets/photo-1.webp"`
  - `"gallery": ["./assets/photo-2.webp", "./assets/photo-4.webp", "./assets/photo-end.webp"]`
- Apne manpasand gaane ke liye MP3 file ko `assets/bgm.mp3` se replace kar sakte hain.

---

## 📁 Project Structure

```
c:\Users\akash\Documents\card\
│
├── index.html         # Main invitation webpage (clean, optimized, standalone)
├── nb.css             # Royal wedding styling, palace arches, gold foil gradients
├── nb.js              # Scratch card canvas, genda ki ladi, animations, RSVP modal
├── wv-data.js         # Configuration data processor
├── wv-sample.js       # All wedding content (names, dates, events, family, phone)
├── README.md          # Guide & documentation
│
└── assets/            # High-resolution media assets (21 files)
    ├── bgm.mp3           # Royal Shehnai / wedding instrumental track
    ├── env.mp4           # 3D Envelope opening animation video
    ├── p8.webp           # Envelope cover poster with wax seal
    ├── p7.webp           # Lord Ganesha illustration
    ├── p4.webp           # Royal rose garland arch topper
    ├── c-varmala.webp    # Varmala caricature illustration
    ├── c-baraat.webp     # Baraat procession caricature
    ├── c-walk.webp       # Couple walking together illustration
    ├── genda.webp        # Marigold bloom asset for the vine
    ├── jhoomer.webp      # Antique swinging chandelier
    ├── rose-bouquet.webp # Rose sprig decoration
    ├── frame-oval.webp   # Baroque vintage gold oval mirror frame
    ├── photo-1.webp      # Couple photo 1
    ├── photo-2.webp      # Couple photo 2
    ├── photo-4.webp      # Couple photo 3
    └── photo-end.webp    # Couple photo 4
```
