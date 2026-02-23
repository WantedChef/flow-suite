/**
 * Types voor de OpenClaw MC API routing responses
 */

export interface FlowDefinition {
  to: string | string[];
  action?: string;
  condition?: string;
  [key: string]: unknown;
}

export interface Topic {
  name?: string;
  type?: string;
  description?: string;
  flows?: Record<string, FlowDefinition>;
  [key: string]: unknown;
}

export interface RoutingData {
  topics: Record<string, Topic>;
  version?: string;
  updated_at?: string;
}
