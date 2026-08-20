// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern (topical, news-anchored lures outperform generic ones) is well
// documented; the specific lift is not the point of the page.
//
// Surface is a browser tab (lookalike-domain landing page), NOT email,
// so the OffSec bias cards don't all read as "another inbox".
// Post-breach phishing increasingly arrives via sponsored search
// results and headline-anchored URLs, which fits the availability
// heuristic better than a generic vendor email anyway.

import type { OffsecBiasContent } from '../types';

const content: OffsecBiasContent = {
  tell: 'Երբ էջն օրինական է թվում, որովհետև արձագանքում է այն պատմությանը, որ առավոտյան կարդացել եք, հենց այդ հիշողությունն է խայծի աշխատանքը։ Այն, թե որքան հեշտ է ինչ-որ բան հիշվում, ոչինչ չի ասում դրա իրական լինելու մասին։',
  scenario:
    'NorthBank կոչվող բանկը հենց նոր կոտրվել է, և նորությունն ամենուր է։ Դուք բոլորովին այլ տեղ եք աշխատում, բայց երկու ֆիշինգային էջ էլ ձեզնից նույն բանն են խնդրում. ձեր աշխատանքային մուտքանունը։ Նրանց միակ տարբերությունն այն է, որ մեկը հիշատակում է NorthBank-ի կոտրումը, որի մասին դուք հենց նոր կարդացիք։',
  visualLabel: 'Սցենար',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Առանց նորության կեռիկի',
      host: 'account-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading: 'Հաստատեք ձեր հաշիվը շարունակելու համար',
      pageBody:
        'Սովորական անվտանգության ստուգում։ Մուտք գործեք աշխատանքային հաշվով, որպեսզի հաստատենք, որ ձեր հասանելիությունը դեռ վավեր է։',
      cta: 'Մուտք գործել SSO-ով',
    },
    after: {
      kind: 'browser',
      tag: 'Կապված նորությանը',
      host: 'northbank-breach-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading:
        'Հաստատեք SSO-ն, որպեսզի գնահատենք NorthBank-ի հետ կապված ձեր ռիսկը',
      pageBody:
        'Մեր թիմը ձեր դոմենը նշել է NorthBank-ի տվյալների զանգվածում։ Մուտք գործեք աշխատանքային հաշվով, որպեսզի մինչև օրվա վերջ գնահատենք արտահոսքի ծավալը։',
      cta: 'Մուտք գործել SSO-ով',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Ինչու է դա աշխատում',
  whyItWorks:
    'Առաջին էջն ակնթարթորեն կասկած է առաջացնում. մուտքի հարցում ոչ մի տեղից։ Երկրորդը խնդրում է ճիշտ նույն բանը, բայց սպասված է թվում, որովհետև այս շաբաթ կոտրման մասին խոսում են ամենուր։ Սա հասանելիության էվրիստիկն է։ Ձեր ուղեղը դադարում է հարցնել «որքանով է հավանական, որ սա իրական է» և սկսում է հարցնել «որքան հեշտ եմ սա հիշում», իսկ հիմա հիշելը ոչ մի ջանք չի պահանջում։ Դուք «ես հենց նոր կարդացի սրա մասին» միտքը դնում եք «պետք է ստուգեմ այս հասցեն» մտքի փոխարեն։ Բեռը նույնն է, սոցիալական ինժեներիան անում է նորությունը։',
  defenseLabel: 'Պաշտպանվեք',
  defense: {
    lede: 'Մինչ ձեր անվտանգության թիմը զբաղվում է պարագծով, ահա ձեր տնային աշխատանքը։',
    moves: [
      'Երբ էջը հենվում է այսօրվա նորության վրա, որպեսզի ձեզ շարժի, հենց այդ պահին պետք է դանդաղել, ոչ թե արագացնել։ Ձեր զգացած շտապողականությունը հարձակման աշխատանքն է։',
      'Կարդացեք ամբողջ հոսթի անունը ձախից աջ, նախքան որևէ բան մուտքագրելը։ Հարձակվողները ձեր վստահած ապրանքանիշը դնում են որպես իրենց դոմենի ենթադոմեն։ Կարևորն ամենաաջ հատվածն է։',
      'Թող դատավորը ձեր գաղտնաբառերի կառավարիչը լինի։ Եթե այն մուտքի էջում ինքնաշխատ չի լրացնում, ուրեմն դա այն էջը չէ, ինչ կարծում եք։ Մի շրջանցեք, փակեք ներդիրը։',
      'Վայրէջքի էջին հիշատակված ցանկացած կոտրում ընդունեք որպես պնդում, ոչ թե փաստ։ Ստուգեք ընկերության սեփական կարգավիճակի էջը կամ Have I Been Pwned-ը, նախքան որևէ այլ տեղ մուտք գործեք։',
    ],
  },
};

export default content;
