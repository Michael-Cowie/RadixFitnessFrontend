<div align="center">
  <h1> Mobile Responsiveness </h1>
</div>

For an overview of CSS responsive design, I have written up a concise document [explanining the basics.](https://github.com/Michael-Cowie/Notes/blob/main/Web/CSS/responsive_design.md)

All components in this project follow a mobile first methodology where base styles target mobile devices and responsive variants are applied at larger breakpoints. For example, a component might use `flex-col md:flex-row` to display content vertically on mobile devices and horizontally on medium screens and above. This ensures optimal usability on smaller screens while taking advantage of additional space on larger displays.

```HTML
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2"> Mobile: full width, Desktop: half width </div>
  <div class="w-full md:w-1/2"> Mobile: full width, Desktop: half width </div>
</div>
```

Mobile responsiveness extends beyond layout to visual assets. SVG background images may require multiple versions to maintain proper visual hierarchy across different aspect ratios. When a single image is stretched or cropped to fit various screen dimensions, important visual elements may be compromised.

This project uses the HTML `<picture>` element with `<source>` and `<img>` tags to serve different images based on device characteristics.

```HTML
const LoginPageBackground = () => (
  <picture>
    <source
      media="(orientation: landscape)"
      srcSet="/homepage_background_desktop_16_9.svg"
    />
    <img
      src="/homepage_background_mobile_9_16.svg"
      alt="Homepage background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  </picture>
);
```

1. The browser evaluates each `<source>` tag in order from top to bottom.
2. For each `<source>` it checks if the `media` query is a match and if the browser supports the format.
3. If a `<source>` matches it uses the `srcSet` from that `<source>` and **ignores the** `<img src="...">`.
4. If no `<source>` matches, the browser falls back to the `<img>`s `src`.

```CSS
@media (orientation: landscape) {
  /* Applies when width >= height */
}

@media (orientation: portrait) {
  /* Applies when height > width */
}
```