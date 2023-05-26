import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/redux';
import {
  selectorUserSettingsSlice,
  setSearchDebounce
} from '../../store/reducers/userSettingsSlice';

interface FormDebounceProps {}

const FormDebounce: FC<FormDebounceProps> = () => {
  const dispatch = useAppDispatch();
  const { searchDebounce } = useSelector(selectorUserSettingsSlice);

  const [debounceInputDisabled, setDebounceInputDisabled] = useState(true);
  const [debounceInputValue, setDebounceInputValue] = useState(searchDebounce);
  const inputDebounce = useRef<HTMLInputElement>(null);

  const handleEditDebounce = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDebounceInputDisabled(false);
  };

  const handleSaveDebounce = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setSearchDebounce(debounceInputValue));
    setDebounceInputDisabled(true);
  };

  useEffect(() => {
    if (!debounceInputDisabled && inputDebounce.current) {
      inputDebounce.current.focus();
    }
  }, [debounceInputDisabled]);

  return (
    <form onSubmit={handleSaveDebounce} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <label htmlFor="debounce">The speed of sending a search request (debounce) (ms)</label>
      <input
        id="debounce"
        style={{ width: 200 }}
        ref={inputDebounce}
        disabled={debounceInputDisabled}
        type="number"
        placeholder="value for debounce"
        step={500}
        min={0}
        max={10000}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDebounceInputValue(Number(e.target.value))
        }
        value={debounceInputValue}
      />
      {debounceInputDisabled ? (
        <button style={{ width: 100 }} type="button" onClick={handleEditDebounce}>
          Edit
        </button>
      ) : (
        <button style={{ width: 100 }} type="submit">
          Save
        </button>
      )}
    </form>
  );
};

export default FormDebounce;
