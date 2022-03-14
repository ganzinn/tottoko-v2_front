import { Box, Avatar, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  name?: string;
  avatarUrl?: string;
  dob?: {
    year?: number;
    month?: number;
    day?: number;
  };
  age?: {
    years: number;
    months: number;
  };
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const CreatorCard: VFC<Props> = memo(
  ({ name, avatarUrl, dob, age, onClick = () => undefined }) => (
    <Box
      borderWidth="1px"
      borderRadius="sm"
      shadow="sm"
      bgColor="white"
      p={2}
      onClick={onClick}
      _hover={{ bgColor: 'gray.100', cursor: 'pointer' }}
      _focus={{ boxShadow: 'outline', outline: '0' }}
      // _active={{ outline: 'blue.200' }}
      tabIndex={0}
    >
      <Box width="full" display="flex" gap={2} alignItems="center">
        <Avatar title={name} src={avatarUrl || undefined} />
        <Box>
          <Text fontWeight="bold" wordBreak="break-word">
            {name}
          </Text>
          <Text fontSize="sm" fontWeight="normal">
            {age?.years}歳{age?.months}ヵ月 / {dob?.year}年{dob?.month}月
            {dob?.day}日
          </Text>
        </Box>
      </Box>
    </Box>
  ),
);
