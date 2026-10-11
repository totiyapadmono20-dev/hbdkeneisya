# Keneisya's Digital Oasis

Create a highly interactive, aesthetic single-page birthday website for "Keneisya". 

DESIGN & AESTHETIC DIRECTION:
- The website must look elegant, cute, and charming. 
- Use a refined color palette consisting of warm pastel pinks, soft rose gold, blush pink backgrounds, white accents, and deep berry/rose gold text for strong readability.
- Incorporate elegant custom glassmorphism effects (backdrop-blur), smooth frame transitions, floating heart particles, and soft glowing drop-shadows.
- Typography should mix clean modern sans-serif for UI elements and graceful, flowing script/serif fonts for headers and greetings to keep it charming yet sophisticated.

REQUIRED FEATURES:

1. Splash Screen & Autoplay Trigger:
- Create an initial full-screen overlay (Splash Screen) that acts as a beautiful gateway.
- Display a charming text: "a special digital space crafted just for you." and a prominent aesthetic button labeled "enter keneisya's oasis ✨".
- Clicking this button must instantly trigger the background audio to play the song "Love Epiphany by Reality Club" smoothly and fade out the splash screen to reveal the main website content.

2. Connected Spotify Soundscape & The Fender Serenade Widget (Dynamic Sync Integration):
- Create a dual-component music experience where the Custom Spotify Player and the Fender Telecaster Guitar Widget are reactively linked.
- The Spotify Player should feature a functional search bar allowing Keneisya to look up or select tracks using the Spotify Web API (defaulting initially to "Love Epiphany" by Reality Club).
- LINKED MECHANIC: When a track is active or changed by Keneisya, the Fender Serenade Widget must programmatically update its 4 chord buttons to display the correct guitar tabs and chord shapes corresponding to that specific song. 
- INTERACTIVE MECHANIC (AUTO-MUTE): When Keneisya clicks or strums any chord/string on the pink-accented Fender guitar widget, the background Spotify track volume must automatically fade out/pause so the clear instrumental guitar note sound can be heard perfectly without background noise. Once she stops interacting with the guitar, the background track should smoothly fade in and resume playing.
- INTERACTIVE LYRIC INTEGRATION: Below the player, implement a synchronized "Karaoke Lyrics" feature. As the song plays, the lyrics scroll up automatically. If Keneisya plays a specific chord sequence correctly on the Fender widget (e.g., matching the song's progression), it will instantly advance the song timeline or unlock a special custom lyric block.
- LYRIC SURPRISE: Programmatically inject this human-sounding birthday text into the lyric stream smoothly during track transitions (ensure it remains completely lowercase):
"happy birthday to my favorite person, keneisya! 🤍 having you in my life is hands down one of the best things ever. kita emang jauh, terhalang jarak, and honestly, ldr isn’t easy. tapi tiap kali denger suara kamu, it always feels like home. thank you for being you, for your endless patience, and for staying by my side. i’m so incredibly proud of you and everything you do. happy birthday, neis. i miss you so much and enjoy your special day! ✨❤️"

3. Elegant Filmstrip Photo & Video Gallery (Klise Foto):
- Create a dedicated section styled like an elegant, horizontal filmstrip (klise foto) but stylized with soft rose gold/pink dark borders and distinct film sprocket holes.
- The gallery must be smooth-scrolling horizontally and contain mixed media placeholders for both Photos and Videos of Keneisya.
- Include subtle image filters (like a soft vintage glow) that lift when hovered.
- Videos within the filmstrip should display a clean custom play-overlay icon. Clicking any photo or video must trigger a beautiful modal lightbox popup, allowing Keneisya to view the image in high resolution or play the video clip inline with custom media controls.

4. "Micro-Wins" & Mood Booster Tracker:
- A dedicated interactive dashboard called "keneisya's daily reminders & trophies".
- List 3-4 customizable "micro-wins" (e.g., "survived a super busy day", "smiled today", "took a well-deserved rest").
- Keneisya can check these off. Checking an item triggers a beautiful pink and gold confetti explosion across the screen and reveals a sweet, custom appreciation note from her partner.

5. The Virtual Companion (Pet-the-Pet):
- Place a cute, animated pixel-art style virtual pet at the bottom corner of the website.
- When clicked or hovered, it triggers a "Petting" animation and displays dynamic, comforting speech bubbles like "you did amazing today, keneisya!", "take a deep breath!", or "someone loves you so much! ❤️".

6. The LDR Interactive Connection Hub:
- A dedicated section celebrating the long-distance relationship.
- Visual Element: Display two clean digital clocks showing the current local times of both partners, connected by an elegant, animated dashed pink line representing the connection across distance.
- Include a beautiful, glowing button labeled "send a virtual hug". 
- Clicking the button fills Keneisya's screen with a beautiful burst animation of pink hearts and floating stars, followed by a sweet text animation: "hug successfully sent across the distance! check your discord, i've just been notified! ❤️".
- The click triggers a redirect or link out to a Discord DM with User ID "557942087446953985" with a preset text saying: "keneisya just claimed her birthday hug!".

NETLIFY DEPLOYMENT & TECHNICAL REQUIREMENTS:
- Fully optimized for mobile screens.
- Clean React and Tailwind CSS implementation with smooth frame transitions.
- Netlify uses the TanStack server through Nitro's Netlify preset; Nitro generates the server function and routing rules. Do not add a static `/* /index.html 200` fallback.

This project was built with [Lovable](https://lovable.dev).

## Deploy to Netlify

Connect this repository to Netlify and deploy the latest revision. `netlify.toml` configures the build command, `dist` publish directory, Node 22, Nitro's Netlify server preset, and the Spotify search function. Both TanStack server functions and the existing `/api/spotify-search` fallback run on Netlify.

Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in Netlify's environment variables for the Functions runtime, then redeploy. Never prefix the secret with `VITE_` or put it in browser code. Lovable secrets are not transferred to Netlify automatically. Rotate any Spotify secret previously shared in chat.

The `pretty girl` photo and `cutest girl` video/poster resolve through the public Lovable asset origin and can load on Netlify without a local `/__l5e` endpoint. Keep that public origin available. Birthday images imported from the source are bundled normally.

The letter, guitar, clocks, trophies, pet, gallery controls, and Discord link are browser interactions and remain available on Netlify. New visitor uploads last only for the current visit. Spotify playback/autoplay remains subject to Spotify and browser restrictions; guitar chords are practice arrangements, not verified song transcriptions. Discord opens the recipient's chat with a message copied where clipboard permission allows; it does not automatically send a notification.

**Live app**: https://hbdkeneisya.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/729532e0-69fc-419d-8a9e-f73d55a60b01).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
