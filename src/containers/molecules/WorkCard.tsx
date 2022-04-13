import { VFC } from 'react';
import {
  Box,
  Skeleton,
  Image,
  Text,
  useBreakpointValue,
  Flex,
  FlexProps,
} from '@chakra-ui/react';
import {
  createSearchParams,
  Link as ReactRouterLink,
  useNavigate,
} from 'react-router-dom';

import { Work } from 'feature/models/work';
import { BaseLink } from 'components/atoms/BaseLink';

type Props = {
  work: Work;
  rootProps?: FlexProps;
};

export const WorkCard: VFC<Props> = ({ work, rootProps }) => {
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const padding = useBreakpointValue({ base: '2', md: '4' });
  const navigate = useNavigate();

  const dateArry = work.date.split('-');
  const date = `${Number(dateArry[0])}年${Number(dateArry[1])}月${Number(
    dateArry[2],
  )}日`;

  const linkParam = createSearchParams({
    'creator_ids[]': [work.creator.id],
  }).toString();

  const handleClick = () => {
    navigate(`/works/${work.id}`);
  };

  return (
    <Box
      bg="white"
      shadow="md"
      tabIndex={0}
      _hover={{ shadow: 'lg', cursor: 'pointer' }}
      _focus={{ shadow: 'outline', outline: '0' }}
      onClick={handleClick}
    >
      <Flex flexDirection="column" h="100%" {...rootProps}>
        <Flex justifyContent="space-between" p={padding}>
          <Text fontSize={fontSize} fontWeight="bold">
            {date}
          </Text>
          <BaseLink
            as={ReactRouterLink}
            to={{ search: linkParam }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Text fontSize={fontSize} fontWeight="bold">
              {work.creator.name}
            </Text>
          </BaseLink>
        </Flex>
        <Box
          position="relative"
          borderColor="gray.400"
          backgroundColor="gray.100"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            maxW="100%"
            maxH="100%"
            src={work.indexImageUrl}
            alt={work.title}
            fallback={<Skeleton w="300px" h="300px" />}
          />
          {/* likeボタン配備 */}
        </Box>

        {work.title && (
          <Text fontSize={fontSize} fontWeight="bold" p={2} textAlign="center">
            {work.title}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
