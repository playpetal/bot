const buttonStyles = {
  blue: 1,
  gray: 2,
  green: 3,
  red: 4,
} as const;

type Button = {
  type: 2;
  label: string;
  custom_id: string;
  style: 1 | 2 | 3 | 4;
};

export function button(
  label: string,
  customId: string,
  style: keyof typeof buttonStyles,
  disabled: boolean = false
) {
  return {
    type: 2 as const,
    label,
    custom_id: customId,
    style: buttonStyles[style],
    disabled,
  };
}

export function row(...buttons: Button[]) {
  return {
    type: 1 as const,
    components: buttons,
  };
}
