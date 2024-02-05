import { useEventTarget } from "ahooks";

export function useEventTargetInAntd<T>({
  initialValue,
  transformer,
}: {
  initialValue: T;
  transformer?: (value: T) => T;
}) {
  const [value, { onChange, reset }] = useEventTarget({ initialValue });

  const onChangeInAntd = (e: T) => {
    onChange({
      target: {
        value: e,
      },
    });
  };

  return [value, { onChangeInAntd, reset, onChange }] as const;
}
