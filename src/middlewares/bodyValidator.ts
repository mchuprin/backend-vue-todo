import {Request, Response} from 'express';

type ValidationRule =
  'required' |
  { min: number } |
  { max: number } |
  ((data: any) => string | null)

type ValidationRules = Record<string, ValidationRule>;

const isRuleRequired = (rule: ValidationRule) => rule === 'required';
const isRuleMax = (rule: ValidationRule) => {
  return typeof rule === 'object' && rule.hasOwnProperty('max');
}
const isRuleMin = (rule: ValidationRule) => {
  return typeof rule === 'object' && rule.hasOwnProperty('min');
}
const isRuleFn = (rule: ValidationRule) => {
  return typeof rule === 'function';
}

const validateRequired = (value: any) => {
  return !value && 'This field is required';
}
const validateMax = (value: any, max: number) => {
  return value.length > max && `The max value is ${max}`;
}
const validateMin = (value: any, min: number) => {
  return value.length < min && `The min value is ${min}`;
}

const errAccumulator = (errors: Record<string, string>, field: string) => {
  return (fn: Function) => {
    const err = fn();
    if (err) {
      errors[field] = err;
      return true;
    }
  }
}

module.exports = (rules: ValidationRules) => {
  return (req: Request, res: Response, next) => {
    const fields = Object.keys(rules);
    const errors = {};

    fields.forEach((field) => {
      const validate = errAccumulator(errors, field);
      const value = req.body[field]

      const fieldRule = rules[field];
      const fieldRules = Array.isArray(fieldRule) ? fieldRule : [fieldRule];
      fieldRules.forEach((rule) => {
        if (isRuleRequired(rule) && validate(() => validateRequired(value))) {
          return;
        }

        if (!value) { return; }

        if (isRuleMax(rule)) {
          const max = (rule as { max: number }).max
          if (validate(() => validateMax(value, max))) {
            return;
          }
        }

        if (isRuleMin(rule)) {
          const min = (rule as { min: number }).min
          if (validate(() => validateMin(value, min))) {
            return;
          }
        }

        if (isRuleFn(rule)) {
          if (validate(() => (rule as ((data: any) => string | null))(value))) {
            return;
          }
        }
      })
    })

    if (Object.keys(errors).length !== 0) {
      return res
        .status(400)
        .send({
          errors,
          msg: 'Validation failed',
        })
    }
    next()
  }
}