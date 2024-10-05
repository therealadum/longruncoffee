import { ICartItem } from "../../common/product";

const operators = [
  {
    name: "CONTAINS_VARIANT_IDS",
    label: "Includes IDs",
    evaluator: (field, operator, value) => {
      return ({ cartState, subscriptionCartState }) => {
        return Boolean(
          cartState.items.find(
            (item: ICartItem) => value.indexOf(item.variant_id) !== -1,
          ),
        );
      };
    },
  },
  {
    name: "NOT_CONTAINS_VARIANT_IDS",
    label: "Does not include IDs",
    evaluator: (field, operator, value) => {
      return ({ cartState, subscriptionCartState }) => {
        return Boolean(
          !cartState.items.find(
            (item: ICartItem) => value.indexOf(item.variant_id) !== -1,
          ),
        );
      };
    },
  },
  { name: "VARIANT_QUANTITY", label: "Variant Quantity" },
];

export const evaluateQuery = (query, data) => {
  const evaluateRule = (rule) => {
    const { field, operator, value } = rule;
    const operatorObj = operators.find((op) => op.name === operator);

    if (operatorObj && operatorObj.evaluator) {
      // Use the custom operator's evaluator to compare
      return operatorObj.evaluator(field, operator, value)(data);
    }
    return false;
  };

  const evaluateGroup = (group) => {
    // Evaluate rules and groups within this group
    return group.rules
      .map((ruleOrGroup) => {
        if (ruleOrGroup.rules) {
          // Recursively evaluate nested group
          return evaluateGroup(ruleOrGroup);
        } else {
          // Evaluate individual rule
          return evaluateRule(ruleOrGroup);
        }
      })
      .reduce((acc, curr) => {
        // Combine results based on the combinator (and/or)
        if (group.combinator === "and") {
          return acc && curr;
        } else if (group.combinator === "or") {
          return acc || curr;
        }
      }, group.combinator === "and"); // Initial value: true for 'and', false for 'or'
  };

  return evaluateGroup(query);
};
