# Artwork display rules

When adding or updating artwork on `art.html`, inspect the source image dimensions first and assign the matching class:

- Aspect ratio above `1.1`: landscape — default `art-item`, displayed up to 360 px wide.
- Aspect ratio below `0.9`: portrait — add `art-item--portrait`, displayed up to 280 px wide.
- Aspect ratio from `0.9` through `1.1`: square — add `art-item--square`, displayed up to 280 px wide.

Keep the image's natural height (`height: auto`); do not crop or distort it. Add the image's actual `width` and `height` attributes in the HTML.
