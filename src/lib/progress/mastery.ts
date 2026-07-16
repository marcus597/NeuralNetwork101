import type { MasteryRule } from "@/lib/content/schema";
import type { SimSnapshot } from "@/engines/interaction/types";

function resolveOp(
  rule: Pick<MasteryRule, "op" | "operator">,
): "gte" | "lte" | "gt" | "lt" | "eq" {
  if (rule.op) return rule.op;
  switch (rule.operator) {
    case ">=":
      return "gte";
    case "<=":
      return "lte";
    case ">":
      return "gt";
    case "<":
      return "lt";
    case "==":
      return "eq";
    default:
      return "gte";
  }
}

function compare(
  a: number,
  op: "gte" | "lte" | "gt" | "lt" | "eq",
  b: number,
): boolean {
  switch (op) {
    case "gte":
      return a >= b;
    case "lte":
      return a <= b;
    case "gt":
      return a > b;
    case "lt":
      return a < b;
    case "eq":
      return a === b;
    default:
      return false;
  }
}

export type MasteryEvent = {
  ruleId: string;
  passed: boolean;
  snapshot: SimSnapshot;
};

export function evaluateMastery(
  rule: MasteryRule,
  snapshot: SimSnapshot,
): boolean {
  if (rule.requiresReveal && !snapshot.flags.revealed) return false;

  switch (rule.type) {
    case "threshold": {
      const v = snapshot.metrics[rule.metric ?? ""];
      if (v === undefined) return false;
      return compare(v, resolveOp(rule), rule.value ?? 0);
    }
    case "flag":
      return Boolean(snapshot.flags[rule.flag ?? ""]);
    case "comparison": {
      const a = snapshot.metrics[rule.metric ?? ""];
      if (a === undefined) return false;
      const b = rule.compareMetric
        ? (snapshot.metrics[rule.compareMetric] ?? 0) * (rule.multiplier ?? 1)
        : (rule.value ?? 0);
      const overfit = compare(a, resolveOp(rule), b);
      if (!overfit || !rule.thenRecover) return overfit;
      const recovered = snapshot.metrics[rule.thenRecover.metric];
      if (recovered === undefined) return false;
      const recoverOp =
        rule.thenRecover.operator === "<="
          ? "lte"
          : rule.thenRecover.operator === ">="
            ? "gte"
            : rule.thenRecover.operator === "<"
              ? "lt"
              : rule.thenRecover.operator === ">"
                ? "gt"
                : "eq";
      return compare(recovered, recoverOp, rule.thenRecover.value);
    }
    case "sequence":
      return (rule.steps ?? []).every((s) => snapshot.flags[s]);
    case "quizPass":
      return Boolean(snapshot.flags.quizPassed);
    default:
      return false;
  }
}
