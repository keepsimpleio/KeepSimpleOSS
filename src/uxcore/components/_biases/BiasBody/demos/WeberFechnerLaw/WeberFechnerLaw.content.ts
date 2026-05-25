const content = {
  en: {
    title: "Today's Deals",
    addToCart: 'Add to Cart',
    items: [
      {
        name: 'Phone Case',
        category: 'Accessories',
        oldPrice: '$30',
        newPrice: '$25',
        beforeDiscount: '$5 OFF',
        afterDiscount: '20% OFF',
        afterHot: true,
      },
      {
        name: 'Ergonomic Chair',
        category: 'Furniture',
        oldPrice: '$505',
        newPrice: '$500',
        beforeDiscount: '$5 OFF',
        afterDiscount: '1% off',
        afterHot: false,
      },
    ],
  },
  ru: {
    title: 'Акции сегодня',
    addToCart: 'В корзину',
    items: [
      {
        name: 'Чехол для телефона',
        category: 'Аксессуары',
        oldPrice: '$30',
        newPrice: '$25',
        beforeDiscount: '−$5',
        afterDiscount: '−20%',
        afterHot: true,
      },
      {
        name: 'Эргономичное кресло',
        category: 'Мебель',
        oldPrice: '$505',
        newPrice: '$500',
        beforeDiscount: '−$5',
        afterDiscount: '−1%',
        afterHot: false,
      },
    ],
  },
  hy: {
    title: 'Այսօրվա առաջարկները',
    addToCart: 'Ավելացնել զամբյուղ',
    items: [
      {
        name: 'Հեռախոսի պատյան',
        category: 'Աքսեսուարներ',
        oldPrice: '$30',
        newPrice: '$25',
        beforeDiscount: '$5 ԶԵՂՉ',
        afterDiscount: '20% ԶԵՂՉ',
        afterHot: true,
      },
      {
        name: 'Էրգոնոմիկ աթոռ',
        category: 'Կահույք',
        oldPrice: '$505',
        newPrice: '$500',
        beforeDiscount: '$5 ԶԵՂՉ',
        afterDiscount: '1% զեղչ',
        afterHot: false,
      },
    ],
  },
};

export default content;
