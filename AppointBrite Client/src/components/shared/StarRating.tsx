/**
 * Star rating display/input component.
 */
import { Rating, type RatingProps } from '@mui/material';

interface StarRatingProps extends Omit<RatingProps, 'onChange'> {
  onChange?: (value: number) => void;
}

export default function StarRating({ onChange, ...props }: StarRatingProps) {
  return (
    <Rating
      precision={0.5}
      onChange={(_event, newValue) => {
        if (onChange && newValue !== null) {
          onChange(newValue);
        }
      }}
      sx={{
        '& .MuiRating-iconFilled': {
          color: '#F59E0B',
        },
      }}
      {...props}
    />
  );
}
