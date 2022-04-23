import { useState, VFC } from 'react';
import {
  AspectRatio,
  Box,
  BoxProps,
  Circle,
  Flex,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Image,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import {
  Carousel,
  CarouselSlide,
  useCarousel,
} from 'containers/atoms/Carousel';

const CarouselIconButton = (props: IconButtonProps) => (
  <IconButton
    display="none"
    fontSize="lg"
    isRound
    boxShadow="base"
    bg="rgba(0, 0, 0, 0.4)"
    _hover={{ bg: 'gray.600' }}
    _active={{ bg: 'gray.800' }}
    _focus={{ boxShadow: 'inerhit' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

type Props = {
  imageUrls?: string[];
  aspectRatio?: number;
  rootProps?: BoxProps;
};

export const ImageGallery: VFC<Props> = ({
  imageUrls,
  aspectRatio = 4 / 3,
  rootProps,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideLoaded, setSlideLoaded] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const [ref, slider] = useCarousel({
    loop: true,
    // eslint-disable-next-line no-shadow
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    created: () => {
      setSlideLoaded(true);
    },
  });

  if (imageUrls === undefined) {
    return (
      <AspectRatio ratio={aspectRatio} _hover={{ opacity: 1 }}>
        <Image fallback={<Skeleton w="full" h="full" />} />
      </AspectRatio>
    );
  }

  return (
    <>
      {isOpen && (
        <Flex
          onClick={onToggle}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            top: 0,
            left: 0,
            w: '100vw',
            h: '100vh',
            bgColor: 'gray.500',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
          }}
        >
          <Image
            src={imageUrls[currentSlide]}
            maxW="full"
            maxH="full"
            alt={imageUrls[currentSlide]}
            fallback={<Skeleton w="full" h="full" />}
          />
        </Flex>
      )}
      <Box
        position="relative"
        sx={{
          _hover: {
            '> button': {
              display: 'inline-flex',
            },
          },
        }}
        {...rootProps}
      >
        <Carousel ref={ref}>
          {imageUrls.map((imageUrl, i) => (
            <CarouselSlide key={imageUrl}>
              <AspectRatio
                ratio={aspectRatio}
                transition="all 200ms"
                opacity={currentSlide === i ? 1 : 0.4}
                _hover={{ opacity: 1 }}
              >
                <Box bgColor="gray.500" onClick={onToggle} cursor="zoom-in">
                  <Image
                    src={imageUrl}
                    objectFit="contain"
                    alt={imageUrl}
                    maxW="full"
                    maxH="full"
                    fallback={<Skeleton />}
                  />
                </Box>
              </AspectRatio>
            </CarouselSlide>
          ))}
        </Carousel>
        {slideLoaded && imageUrls.length >= 2 && (
          <>
            <CarouselIconButton
              pos="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              onClick={() => slider.current?.prev()}
              icon={
                <Icon as={IoChevronBackOutline} color="white" boxSize={8} />
              }
              aria-label="Previous Slide"
            />
            <CarouselIconButton
              pos="absolute"
              right="3"
              top="50%"
              transform="translateY(-50%)"
              onClick={() => slider.current?.next()}
              icon={
                <Icon as={IoChevronForwardOutline} color="white" boxSize={8} />
              }
              aria-label="Next Slide"
            />
            <HStack
              position="absolute"
              width="full"
              justify="center"
              bottom="0"
              py="4"
            >
              {slideLoaded &&
                imageUrls.map((imageUrl, index) => (
                  <Circle
                    key={imageUrl}
                    size="2"
                    bg={currentSlide === index ? 'white' : 'whiteAlpha.400'}
                    onClick={() => {
                      slider.current?.moveToIdx(index);
                    }}
                    cursor="pointer"
                  />
                ))}
            </HStack>
          </>
        )}
      </Box>
    </>
  );
};
