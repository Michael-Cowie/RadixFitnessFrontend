const MainBackground = () => {
  return (
    <picture>
      <img
        src="/main_plain_background.svg"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          objectFit: 'cover',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </picture>
  );
};

export default MainBackground;
