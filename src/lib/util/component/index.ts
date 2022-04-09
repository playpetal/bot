import { Button, Emoji, Select, SelectOption } from "petal";

const buttonStyles = {
  blue: 1,
  gray: 2,
  green: 3,
  red: 4,
} as const;

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

export function select({
  customId,
  options,
  placeholder,
  min_values,
  max_values,
  disabled,
}: {
  customId: string;
  options: SelectOption[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}): Select {
  return {
    type: 3 as const,
    custom_id: customId,
    options,
    placeholder,
    min_values,
    max_values,
    disabled,
  };
}

export function selectOption({
  label,
  value,
  description,
  emoji,
  isDefault,
}: {
  label: string;
  value: string;
  description?: string;
  emoji?: Emoji;
  isDefault?: boolean;
}): SelectOption {
  return { label, value, description, emoji, default: isDefault };
}

export function row(...components: (Button | Select)[]) {
  return {
    type: 1 as const,
    components,
  };
}
