import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const buttonLink = defineStyle({
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  color: '#ffffff',
  padding: '0.5rem',
  display: 'none',
  ' @media (max-width:768px)': {
    display: 'block',
  },
  _hover: {
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#ffffff',
    borderRadius: '5px',
    padding: '0.5rem',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { buttonLink },
});
