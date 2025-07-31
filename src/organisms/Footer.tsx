import styles from 'lib/colours.module.css';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <footer className={`footer items-center p-4 text-neutral-content ${styles.darkBlue}`}>
        <div className="flex flex-col items-center w-full md:flex-row">
          <div className="flex justify-center items-center w-full">
            <span className="mr-2 font-bold"> Radix Fitness </span>
            <a href="https://github.com/Michael-Cowie/RadixFitnessFrontend" target="_blank">
              <img alt="Github" src="/github-11-24.png" />
            </a>
          </div>
        </div>
      </footer>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  position: sticky;
  padding: 0;
  margin: 0;
  margin-top: 25x;
  bottom: 0px;
  width: 100%;
`;
