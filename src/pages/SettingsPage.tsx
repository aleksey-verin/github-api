import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
import FormDebounce from '../components/forms/FormDebounce';
import FormPerPage from '../components/forms/FormPerPage';
import FormRequestType from '../components/forms/FormRequestType';

const SettingsPage: FC = () => {
  return (
    <MainContent>
      <div className="settings">
        <FormDebounce />
        <FormPerPage />
        <FormRequestType />
      </div>
    </MainContent>
  );
};

export default SettingsPage;
