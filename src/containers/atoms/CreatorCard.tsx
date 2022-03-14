import { memo, VFC } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreatorCard } from 'components/atoms/CreatorCard';
import { Creator } from 'feature/models/creator';

type Props = {
  creator?: Creator;
};

export const EnhancedCreatorCard: VFC<Props> = memo(({ creator }) => {
  const navigate = useNavigate();
  const dobArry = creator?.dateOfBirth.split('-');
  const dob = {
    year: dobArry ? Number(dobArry[0]) : undefined,
    month: dobArry ? Number(dobArry[1]) : undefined,
    day: dobArry ? Number(dobArry[2]) : undefined,
  };

  return (
    <CreatorCard
      onClick={() =>
        creator ? navigate(`/creators/${creator.id}`) : undefined
      }
      name={creator?.name}
      avatarUrl={creator?.avatarUrl}
      dob={dob}
      age={creator?.age}
    />
  );
});
