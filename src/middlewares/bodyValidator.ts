import { Request, Response } from 'express';

type ValidationRule =
  'required' |
  { min: number } |
  { max: number } |
  ((data: any) => string | null)

type ValidationRules = Record<string, ValidationRule>;

module.exports = async ( rules: ValidationRules ) => {
  return (req: Request, res: Response, next) => {
    const fields = Object.keys(rules);
    const errors = {};
    fields.forEach((field) => {
      const fieldRule = rules[field];
      const value = req.body[field]
      if (fieldRule === 'required') {
        if (!value) {
          errors[field] = 'This field is required';
        }
      }
      if (typeof fieldRule === 'object' && fieldRule.hasOwnProperty('max')) {
        const max = (fieldRule as { max: number }).max
        if (value > max) {
          errors[field] = `The max value is ${max}`
        }
      }
      if (typeof fieldRule === 'object' && fieldRule.hasOwnProperty('min')) {
        const min = (fieldRule as { min: number }).min
        if (value < min) {
          errors[field] = `The min value is ${min}`
        }
      }
    })
    if (Object.keys(errors).length !== 0) {
      return res
        .status(400)
        .send({
          msg: 'Validation failed',
          errors: errors
        })
    }
    next()
  }
}
