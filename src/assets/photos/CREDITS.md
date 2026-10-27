# Photo credits

Every photograph on g8deck.com is listed here: who took it, where it came from
and the licence it is used under. A photo that is not in this file does not
ship. All four are free-licence Unsplash images (not Unsplash+), downloaded at
2000px wide on 27 October 2026 and served through Astro's `<Image>` as
responsive WebP.

None of them shows a G8Deck customer, and none shows a face: the one person in
frame is seen from behind, so no photo can be read as someone endorsing the
product. The equipment in them belongs to whoever owns it, not to G8Deck.

| File                    | Subject                                                             | Photographer                                                           | Source                                                                                     | Licence                                          | Used in                |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ | ---------------------- |
| `data-centre-floor.jpg` | Server room, rows of cabinets under blue cable trays                | Taylor Vick ([@tvick](https://unsplash.com/@tvick))                    | https://unsplash.com/photos/server-room-with-network-cabinets-aWslrFhs1w4                  | [Unsplash License](https://unsplash.com/license) | Deployment modes       |
| `network-switch.jpg`    | Patch cables into a rack switch, close up                           | Albert Stoynov ([@albertstoynov](https://unsplash.com/@albertstoynov)) | https://unsplash.com/photos/a-close-up-of-a-network-with-wires-connected-to-it-dyUp7WPu5q4 | [Unsplash License](https://unsplash.com/license) | Closing call to action |
| `server-drive-bays.jpg` | Rack server front panel, hot-swap drive bays with lit status lights | Domaintechnik ([@fslfsl](https://unsplash.com/@fslfsl))                | https://unsplash.com/photos/server-rack-with-blinking-green-lights-VHmBX7FnXw0             | [Unsplash License](https://unsplash.com/license) | Problem                |
| `engineer-at-night.jpg` | An engineer at a laptop terminal, seen from behind                  | Chirayu Trivedi ([@rc820](https://unsplash.com/@rc820))                | https://unsplash.com/photos/a-person-is-coding-on-a-laptop-at-night-M1yPeeHZ08w            | [Unsplash License](https://unsplash.com/license) | AI operators           |

The Unsplash License allows commercial use without attribution; we credit
anyway, here and in the page's `figcaption`s.

## Adding a photo

1. Only Unsplash (free licence, never Unsplash+) or Pexels. Check the licence on
   the photo's own page, not the search page.
2. No identifiable face, no customer logo, nothing that reads as an endorsement.
3. Put the original in this folder, render it with `<Image>` from `astro:assets`
   (never a raw `<img>` to a JPEG), give it real alt text, and lazy-load it
   unless it is above the fold.
4. Add its row above in the same commit.
