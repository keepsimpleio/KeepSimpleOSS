export interface RichTextFieldProps {
  /** Stored HTML (the notes dialect: <br />, <strong>, <em>, <s>). */
  value: string;
  onChange: (html: string) => void;
  /** Sits on the header row, with the marks beside it. */
  label: string;
  ariaLabel: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  /** Applied to the editable box itself. */
  editorClassName?: string;
}
