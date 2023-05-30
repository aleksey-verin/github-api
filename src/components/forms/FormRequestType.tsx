import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';

import { selectorUserSettingsSlice, setRequestType } from '../../store/reducers/userSettingsSlice';
import { RequestTypes } from '../../store/reducers/types/repoType';

const FormRequestType: FC = () => {
  const dispatch = useAppDispatch();
  const { requestType } = useSelector(selectorUserSettingsSlice);

  const [requestSelectDisabled, setRequestSelectDisabled] = useState(true);
  const [selectRequestValue, setSelectRequestValue] = useState<RequestTypes>(requestType);
  const selectRequestType = useRef<HTMLSelectElement>(null);

  const handleEditRequestType = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRequestSelectDisabled(false);
  };

  const handleSaveDebounce = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestSelectDisabled(true);
    if (selectRequestValue === requestType) return;
    dispatch(setRequestType(selectRequestValue));
  };

  useEffect(() => {
    if (!requestSelectDisabled && selectRequestType.current) {
      selectRequestType.current.focus();
    }
  }, [requestSelectDisabled]);

  return (
    <form onSubmit={handleSaveDebounce}>
      <label htmlFor="request">Select the types of request to the server (REST or GraphQl)</label>
      <div>
        <select
          id="request"
          ref={selectRequestType}
          disabled={requestSelectDisabled}
          placeholder="value for per page parameter"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectRequestValue(e.target.value as RequestTypes)
          }
          value={selectRequestValue}>
          <option value={RequestTypes.REST}>REST API</option>
          <option value={RequestTypes.GraphQl}>GraphQl API</option>
        </select>
        {requestSelectDisabled ? (
          <button type="button" onClick={handleEditRequestType}>
            Edit
          </button>
        ) : (
          <button type="submit">Save</button>
        )}
      </div>
    </form>
  );
};

export default FormRequestType;
