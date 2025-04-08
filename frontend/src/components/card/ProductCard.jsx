import { Box, Center, useColorModeValue, Heading, Text, Stack, Image } from '@chakra-ui/react';
import { Bookmark, Clock } from 'react-feather';

const ProductCard = ({ title, time, image }) => {
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            // backgroundImage: `url(${image})`,
            filter: 'blur(1px)',
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)'
            }
          }}
        >
          <Image rounded={'lg'} height={230} width={282} objectFit={'cover'} src={image} alt="#" />
        </Box>
        <Stack pt={8}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {title}
          </Heading>
          <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>
            <Stack direction={'row'} align={'center'}>
              <Clock size={20} />
              <Text fontWeight={500} fontSize={'lg'}>
                {time}
              </Text>
            </Stack>
            <Bookmark size={20} />
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};
export default ProductCard;
