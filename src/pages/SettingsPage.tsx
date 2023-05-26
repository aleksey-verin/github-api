import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
// import { useSelector } from 'react-redux';
// import { selectorUserSettingsSlice, setSearchDebounce } from '../store/reducers/userSettingsSlice';
// import { useAppDispatch } from '../hooks/redux';
import FormDebounce from '../components/settings/FormDebounce';
import FormPerPage from '../components/settings/FormPerPage';

interface SettingsPageProps {}

const SettingsPage: FC<SettingsPageProps> = () => {
  return (
    <MainContent>
      <div className="settings">
        <FormDebounce />
        <FormPerPage />
      </div>
    </MainContent>
  );
};

export default SettingsPage;
