import SelectableButton from 'atoms/SelectableButton';
import { getLocalStorage, usePersistenceKey, setLocalStorage } from 'lib/statePersistence';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import ManualAddFoodEntry from './ManualAddFoodEntry';
import SearchAddFoodEntry from './SearchAddFoodEntry';

export interface Props {
  closeModalWindow: () => void;
}

const CreateFoodEntry: React.FC<Props> = ({ closeModalWindow }) => {
  const persistenceKey = usePersistenceKey();

  const [selected, setSelected] = useState<string>(() => {
    const selectedButton = getLocalStorage(persistenceKey, 'selectedSearchButton');
    return selectedButton ? selectedButton : 'Search';
  });

  useEffect(() => {
    setLocalStorage(persistenceKey, 'selectedSearchButton', selected);
  }, [selected, persistenceKey]);

  return (
    <div className="flex justify-center items-center">
      <dialog id="my_modal" className="modal modal-open">
        <FormContainer>
          <div className="modal-box">
            <form>
              <button
                onClick={() => closeModalWindow()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                {' '}
                ✕{' '}
              </button>

              <div className="w-full flex flex-row justify-center">
                <SelectableButton
                  selected={selected === 'Search'}
                  displayText="Search"
                  onClick={() => setSelected('Search')}
                />
                <SelectableButton
                  selected={selected === 'Manual'}
                  displayText="Manual"
                  onClick={() => setSelected('Manual')}
                />
              </div>

              {selected === 'Manual' ? (
                <ManualAddFoodEntry closeModalWindow={closeModalWindow} />
              ) : (
                <SearchAddFoodEntry />
              )}
            </form>
          </div>
        </FormContainer>
      </dialog>
    </div>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
`;

export default CreateFoodEntry;
