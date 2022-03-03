import { useRouter } from 'next/router';
import NiceModal from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { CreateAddonModal } from '../Modals/CreateAddonModal.component';

interface IGroupAddon {
  editHandler?: {
    edit: boolean;
    // eslint-disable-next-line no-unused-vars
    setEdit(edit: boolean): any;
  };
}

export const GroupAddon = (props: IGroupAddon) => {
  const { editHandler } = props;
  const router = useRouter();

  const entity = router.query.id;

  useEffect(() => {
    if (editHandler) {
      const { edit, setEdit } = editHandler;
      if (edit) {
        setEdit(false);
        NiceModal.show(CreateAddonModal, {
          entity,
        });
      }
    }
  }, [editHandler, entity]);

  return (
    <>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus,
      autem ipsam. Corporis possimus quam impedit explicabo nostrum tempora
      dolore tenetur quod ea rem ex quos fuga, voluptas facilis ad vero.
    </>
  );
};
