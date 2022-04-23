import { useState, VFC } from 'react';
import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Skeleton,
  Stack,
  StackProps,
  useDisclosure,
  useBreakpointValue,
  Flex,
} from '@chakra-ui/react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import {
  Carousel,
  CarouselIconButton,
  CarouselSlide,
  useCarousel,
} from 'containers/atoms/Carousel';

type Props = {
  images?: string[];
  aspectRatio?: number;
  rootProps?: StackProps;
};

export const DesktopImageGallery: VFC<Props> = ({
  images = [],
  aspectRatio = 4 / 3,
  rootProps,
}) => {
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = 5;

  const [ref, slider] = useCarousel({
    slides: {
      perView: slidesPerView,
      spacing: 24,
    },
    // eslint-disable-next-line no-shadow
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

  const { isOpen, onToggle } = useDisclosure();
  const maxImagePadding = useBreakpointValue({ base: 0, lg: 6 });

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
            padding: maxImagePadding,
          }}
        >
          <Image
            src={images[index]}
            maxW="full"
            maxH="full"
            alt={images[index]}
            fallback={<Skeleton w="full" h="full" />}
          />
        </Flex>
      )}
      <Stack spacing="4" {...rootProps}>
        <AspectRatio ratio={aspectRatio} onClick={onToggle} cursor="zoom-in">
          <Box bgColor="gray.500">
            <Image
              src={images[index]}
              maxW="full"
              maxH="full"
              alt={images[index]}
              fallback={<Skeleton w="full" h="full" />}
            />
          </Box>
        </AspectRatio>
        <HStack spacing="4">
          {images.length >= 2 && (
            <>
              <CarouselIconButton
                onClick={() => slider.current?.prev()}
                icon={<IoChevronBackOutline />}
                aria-label="Previous slide"
                disabled={currentSlide === 0}
              />
              <Carousel ref={ref} direction="row" width="full">
                {images.map((imageSrc, i) => (
                  <CarouselSlide
                    key={imageSrc}
                    onClick={() => setIndex(i)}
                    cursor="pointer"
                  >
                    <AspectRatio
                      ratio={aspectRatio}
                      transition="all 200ms"
                      opacity={index === i ? 1 : 0.4}
                      _hover={{ opacity: 1 }}
                    >
                      <Image
                        src={imageSrc}
                        objectFit="cover"
                        alt={imageSrc}
                        fallback={<Skeleton />}
                      />
                    </AspectRatio>
                  </CarouselSlide>
                ))}
              </Carousel>
              <CarouselIconButton
                onClick={() => slider.current?.next()}
                icon={<IoChevronForwardOutline />}
                aria-label="Next slide"
                disabled={
                  currentSlide + Number(slidesPerView) === images.length ||
                  images.length <= slidesPerView
                }
              />
            </>
          )}
        </HStack>
      </Stack>
    </>
  );
};
