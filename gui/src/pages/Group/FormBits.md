```tsx
const styles = (theme: Theme) => ({
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
});

<Stepper activeStep={0} className={classes.stepper}>
  <Step key="Init">
    <StepLabel>Init</StepLabel>
  </Step>
  <Step key="Confirm">
    <StepLabel>Confirm</StepLabel>
  </Step>
</Stepper>
```

```tsx
<React.Fragment>
  <Typography variant="h5" gutterBottom>
    Thank you for your order.
  </Typography>
  <Typography variant="subtitle1">
    Your order number is #2001539. We have emailed your order confirmation, and will
    send you an update when your order has shipped.
  </Typography>
</React.Fragment>
```

```tsx
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField id="state" name="state" label="State/Province/Region" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </React.Fragment>
```