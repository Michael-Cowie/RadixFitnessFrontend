import HorizontalVerticalCenteringContainer from 'atoms/design_patterns/CenterContainer';
import ProfileSettings from 'molecules/UserProfile/ProfileSettings';
import PageTemplate from 'templates/PageTemplate';
import LoginPageBackground from './LoginPage/LoginPageBackground';
import { FORM_RESIZER } from 'atoms/design_patterns/constants';

export const ProfileSettingsPage = () => {
  return (
    <PageTemplate>
      <OnboardProfileSettingsPageContainer>
        <ProfileSettings />
      </OnboardProfileSettingsPageContainer>
    </PageTemplate>
  );
};

const OnboardProfileSettingsPageContainer: React.FC<LoginPageContainerProps> = ({ children }) => {
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: 'white',
    border: `1px solid black`,
    borderRadius: '8px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle} className={FORM_RESIZER}>
      {children}
    </div>
  );
};

/**
 * Explicitly remove the Navbar and Footer for the forced profile settings creation page during
 * account creation to prevent the user going to unwanted places.
 */
export const OnboardProfileSettingsPage = () => {
  return (
    <>
      <LoginPageBackground />

      <HorizontalVerticalCenteringContainer>
        <OnboardProfileSettingsPageContainer>
          <ProfileSettings />
        </OnboardProfileSettingsPageContainer>
      </HorizontalVerticalCenteringContainer>
    </>
  );
};
