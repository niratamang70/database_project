import { Box, Center, useColorModeValue, Heading, Text, Stack, Image } from '@chakra-ui/react';
import { Clock } from 'react-feather';
import { FaRegEdit } from 'react-icons/fa';

const ProductCard = ({ title, time, image, handleRecipeEdit }) => {
  return (
    <Center>
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
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box
          rounded={'lg'}
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
            filter: 'blur(1px)',
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)'
            }
          }}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={image ?? '/images/no-recipe.png'}
            alt={title}
          />
        </Box>

        <Stack flex="1" pt={8} pb={4}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500} noOfLines={2}>
            {title}
          </Heading>
        </Stack>

        <Stack direction={'row'} align={'center'} justifyContent={'space-between'}>
          <Stack direction={'row'} align={'center'}>
            <Clock size={20} />
            <Text fontWeight={500} fontSize={'lg'}>
              {time ?? '1 hour'}
            </Text>
          </Stack>
          <FaRegEdit size={20} style={{ cursor: 'pointer' }} onClick={handleRecipeEdit} />
        </Stack>
      </Box>
    </Center>
  );
};
export default ProductCard;
