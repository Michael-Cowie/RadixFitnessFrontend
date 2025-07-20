const LoginPageBackground = () => (
  <picture>
    <source media="(orientation: landscape)" srcSet="/homepage_background/desktop_16_9.svg" />
    <img
      src="/homepage_background/mobile_9_16.svg"
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

export default LoginPageBackground;
