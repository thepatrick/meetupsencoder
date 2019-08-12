import React, { FC } from 'react';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { Field, WrappedFieldProps } from 'redux-form' // ES6
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import asyncValidate from './asyncValidate'

export const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {}
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'favoriteColor',
    'notes'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address'
  }
  return errors
}

interface CustomFieldLabelProps{
  label: string;
}

export const renderTextField: FC<CustomFieldLabelProps & WrappedFieldProps> = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => ( // TextFieldProps
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
);

export const renderCheckbox: FC<CustomFieldLabelProps & WrappedFieldProps> = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  </div>
)

// const radioButton = ({ input, ...rest }) => (
//   <FormControl>
//     <RadioGroup {...input} {...rest}>
//       <FormControlLabel value="female" control={<Radio />} label="Female" />
//       <FormControlLabel value="male" control={<Radio />} label="Male" />
//       <FormControlLabel value="other" control={<Radio />} label="Other" />
//     </RadioGroup>
//   </FormControl>
// )

// const renderFromHelper = ({ touched, error }) => {
//   if (!(touched && error)) {
//     return
//   } else {
//     return <FormHelperText>{touched && error}</FormHelperText>
//   }
// }

// const renderSelectField = ({
//   input,
//   label,
//   meta: { touched, error },
//   children,
//   ...custom
// }) => (
//   <FormControl error={touched && error}>
//     <InputLabel htmlFor="age-native-simple">Age</InputLabel>
//     <Select
//       native
//       {...input}
//       {...custom}
//       inputProps={{
//         name: 'age',
//         id: 'age-native-simple'
//       }}
//     >
//       {children}
//     </Select>
//     {renderFromHelper({ touched, error })}
//   </FormControl>
// )