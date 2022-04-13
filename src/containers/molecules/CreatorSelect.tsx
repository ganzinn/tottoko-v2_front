import { CreatorSelect } from 'components/molecules/CreatorSelect';
import { Creator } from 'feature/models/creator';
import { memo, SetStateAction, VFC } from 'react';

type Props = {
  isLoading?: boolean;
  creators?: Creator[];
  selectedIds?: string[];
  setSelectedIds?: (value: SetStateAction<string[] | undefined>) => void;
  creatorAllIds?: string[];
  isCreatorAllSelected?: boolean;
};

export const EnhancedCreatorSelect: VFC<Props> = memo(
  ({
    isLoading = false,
    creators,
    selectedIds = [],
    setSelectedIds = () => undefined,
    creatorAllIds = [],
    isCreatorAllSelected = false,
  }) => {
    const isIndeterminate =
      creatorAllIds.some((creatorId) => selectedIds.includes(creatorId)) &&
      !isCreatorAllSelected;

    const toggleCreatorAllSelect = isCreatorAllSelected
      ? () => setSelectedIds([])
      : () => setSelectedIds(creatorAllIds);

    const isCreatorSelected = (targetId: string) =>
      selectedIds.includes(targetId);

    const toggleCreatorSelect = (targetId: string) => {
      if (selectedIds.includes(targetId)) {
        setSelectedIds([
          ...selectedIds.filter((selectedId) => selectedId !== targetId),
        ]);
      } else {
        setSelectedIds([...selectedIds.concat([targetId])]);
      }
    };

    return (
      <CreatorSelect
        {...{
          isLoading,
          creators,
          isCreatorAllSelected,
          isIndeterminate,
          toggleCreatorAllSelect,
          isCreatorSelected,
          toggleCreatorSelect,
        }}
      />
    );
  },
);
