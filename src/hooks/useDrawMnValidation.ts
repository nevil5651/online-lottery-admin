import * as Yup from 'yup';

export const drawValidationSchema = Yup.object({
  name: Yup.string().required('Draw name is required'),
  type: Yup.string().required('Draw type is required'),
  ticketPrice: Yup.number()
    .required('Ticket price is required')
    .min(1, 'Price must be at least ₹1'),
  schedule: Yup.object({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    drawTime: Yup.date()
      .required('Draw time is required')
      .min(Yup.ref('endDate'), 'Draw time must be after end date'),
    cutoffMinutes: Yup.number()
      .required('Cutoff minutes is required')
      .min(1, 'Must be at least 1 minute')
      .max(1440, 'Cannot be more than 24 hours')
  }),
  prizes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required('Tier name is required'),
        value: Yup.number().required('Value is required').min(0),
        valueType: Yup.string().required('Value type is required'),
        winners: Yup.number().required('Winners is required').min(1)
      })
    )
    .min(1, 'At least one prize tier is required'),
  security: Yup.object({
    rngMethod: Yup.string().required('RNG method is required'),
    requiredApprovals: Yup.number()
      .required('Approvals required')
      .min(1, 'At least 1 approval required')
      .max(5, 'Maximum 5 approvals')
  })
});

export const useDrawMnValidation = () => {
  return { drawValidationSchema };
};