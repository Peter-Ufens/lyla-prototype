import { FormEvent, KeyboardEvent, useState, type ReactElement } from "react";

interface Props {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props): ReactElement {
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const content = value.trim();
    if (!content || disabled) return;
    onSend(content);
    setValue("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(event);
    }
  };

  return (
    <form className="inputWrap" onSubmit={submit}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="Ecrire un message..."
        rows={3}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Envoyer
      </button>
    </form>
  );
}
