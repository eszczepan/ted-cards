type CharacterCounterProps = {
  currentLength: number;
  maxLength: number;
};

export function CharacterCounter({ currentLength, maxLength }: CharacterCounterProps) {
  const isNearLimit = currentLength > maxLength * 0.8 && currentLength <= maxLength;
  const isOverLimit = currentLength > maxLength;

  return (
    <div
      className={`text-xs mt-1 text-right ${
        isOverLimit ? "text-destructive" : isNearLimit ? "text-yellow-500" : "text-muted-foreground"
      }`}
    >
      {currentLength}/{maxLength}
    </div>
  );
}
