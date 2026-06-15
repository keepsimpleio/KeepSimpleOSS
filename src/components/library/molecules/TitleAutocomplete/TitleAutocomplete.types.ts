import type { UseFormRegisterReturn } from 'react-hook-form';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

export interface TitleAutocompleteProps {
  /** react-hook-form registration for the title field — spread onto the input. */
  registration: UseFormRegisterReturn;
  ariaLabel: string;
  placeholder: string;
  placeholderColor?: string;
  fetchSuggestions: (query: string) => Promise<IAutofillSuggestion[]>;
  onSelect: (suggestion: IAutofillSuggestion) => void;
}
