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
  emoji?: {
    id: string;
  };
  disabled: boolean;
};

export function button({
  customId,
  style,
  label,
  emoji,
  disabled = false,
}: {
  customId: string;
  style: keyof typeof buttonStyles;
  label?: string;
  emoji?: string;
  disabled?: boolean;
}): Button {
  return {
    type: 2 as const,
    label: label as string,
    custom_id: customId,
    style: buttonStyles[style],
    disabled,
    emoji: emoji ? { id: emoji } : undefined,
  };
}

export function row(...buttons: Button[]) {
  return {
    type: 1 as const,
    components: buttons,
  };
}
