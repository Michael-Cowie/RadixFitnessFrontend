import { SyntheticEvent, ReactNode } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface ModalFormProps {
  onSubmit: (e: SyntheticEvent) => void;
  closeModalWindow: () => void;
  children: ReactNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formProviderProps?: UseFormReturn<any>; // Optional react-hook-form context
}

const ModalForm: React.FC<ModalFormProps> = ({
  onSubmit,
  closeModalWindow,
  children,
  formProviderProps,
}) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const form = (
    <form onSubmit={handleSubmit} className="w-full">
      <button
        type="button"
        onClick={closeModalWindow}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      >
        ✕
      </button>
      {children}
    </form>
  );

  return (
    <div className="modal modal-open">
      <div className={`modal-box`}>
        {formProviderProps ? <FormProvider {...formProviderProps}>{form}</FormProvider> : form}
      </div>
    </div>
  );
};

export default ModalForm;
