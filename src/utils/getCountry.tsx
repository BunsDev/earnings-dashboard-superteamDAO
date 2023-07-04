import { India, Vietnam, Turkey, Germany, Mexico, UK } from '@/svgs/countries';

export const getCountry = (value: string) => {
  switch (value) {
    case 'reckMKOOQ59TFRk6n':
      return <India />;
    case 'recJXKIOEDvUjIv9Z':
      return <Vietnam />;
    case 'reciIV94eES6oiIY2':
      return <Turkey />;
    case 'recEdv0ihUicz158R':
      return <Germany />;
    case 'recQuDC0wLiJCdTiH':
      return <Mexico />;
    case 'recw7ExFk21ttX8KT':
      return <UK />;
    default:
      return null;
  }
};
