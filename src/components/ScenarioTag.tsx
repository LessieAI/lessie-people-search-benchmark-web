import type { Scenario } from '@/src/types';
import { SCENARIO_CONFIG } from '@/src/data/constants';
import { Badge } from '@/components/ui/badge';

interface ScenarioTagProps {
  scenario: Scenario;
  className?: string;
}

export function ScenarioTag({ scenario, className }: ScenarioTagProps) {
  const { label, color } = SCENARIO_CONFIG[scenario];

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      {label}
    </Badge>
  );
}
