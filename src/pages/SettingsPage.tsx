import { FC } from 'react';
import MainContent from '../components/ui/MainContent';
// import { useSelector } from 'react-redux';
// import { selectorUserSettingsSlice, setSearchDebounce } from '../store/reducers/userSettingsSlice';
// import { useAppDispatch } from '../hooks/redux';
import FormDebounce from '../components/settings/FormDebounce';
import FormPerPage from '../components/settings/FormPerPage';

interface SettingsPageProps {}

const SettingsPage: FC<SettingsPageProps> = () => {
  // const dispatch = useAppDispatch();
  // const { searchDebounce } = useSelector(selectorUserSettingsSlice);

  // const [debounceInputDisabled, setDebounceInputDisabled] = useState(true);
  // const [debounceInputValue, setDebounceInputValue] = useState(searchDebounce);
  // const inputDebounce = useRef<HTMLInputElement>(null);

  // const handleEditDebounce = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setDebounceInputDisabled(false);
  // };

  // const handleSaveDebounce = (e: React.ChangeEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   dispatch(setSearchDebounce(debounceInputValue));
  //   setDebounceInputDisabled(true);
  // };

  // useEffect(() => {
  //   if (!debounceInputDisabled && inputDebounce.current) {
  //     inputDebounce.current.focus();
  //   }
  // }, [debounceInputDisabled]);

  return (
    <MainContent>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <FormDebounce />
        <FormPerPage />
      </div>
    </MainContent>
  );
};

export default SettingsPage;
