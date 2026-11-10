import { Steps, type StepsProps } from "antd";

interface WorkflowStepsProps extends StepsProps {
  labels: string[];
  current: number;
}

/** Horizontal workflow tracker with scroll and no broken label wrapping. */
export function WorkflowSteps({
  labels,
  current,
  className,
  ...rest
}: WorkflowStepsProps) {
  return (
    <div
      className={`app-workflow-steps -mx-1 overflow-x-auto px-1 pb-1 ${className ?? ""}`}
    >
      <Steps
        size="small"
        current={Math.max(0, current)}
        responsive={false}
        labelPlacement="horizontal"
        items={labels.map((title) => ({ title }))}
        {...rest}
      />
    </div>
  );
}
