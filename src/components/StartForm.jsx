import {Box, Button, Card, Container, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material"
import {Controller, useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";

import {useGridDispatch} from "../GridContext"
import {TrackingResult} from "../models/TrackingResult";
import {addInitialResult, selectPlane} from "../state/gridActions";
import {CORDILLERA, ELYSIUM, ELYSIUM_MAX_X, ELYSIUM_MAX_Y, GENERIC, STYGIA} from "../state/locationData";
import useClasses from "../hooks/useClasses";

const styles = (theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    display: 'flex',
    justifyContent: "center"
  },
  coordWrapper: {
    margin: "0.5rem"
  },
  namesInput: {
    width: "26rem"
  }
})

const schema = yup.object().shape({
  x: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  y: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  revealed: yup.string()
})

export const StartForm = () => {
  const classes = useClasses(styles);
  const dispatch = useGridDispatch()

  const {setError, handleSubmit, control, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
  })

  const checkPlaneBounds = (x, y, plane) => {
    let errors = []
    if (plane === ELYSIUM) {
      if (x > ELYSIUM_MAX_X) {
        errors.push({type: "manual", name: "x", message: "Invalid Elysium coordinate"})
      }
      if (y > ELYSIUM_MAX_Y) {
        errors.push({type: "manual", name: "y", message: "Invalid Elysium coordinate"})
      }
    }
    return errors
  }

  const onSubmit = data => {
    const boundsErrors = checkPlaneBounds(data.x, data.y, data.plane)
    if (boundsErrors.length > 0) {
      boundsErrors.forEach(({name, type, message}) => setError(name, {type, message}))
    } else {
      const parsedNames = data.revealed.split(',').map(str => str.trim());
      const trackingResult = new TrackingResult(data.x, data.y, parsedNames)
      dispatch(selectPlane(data.plane))
      dispatch(addInitialResult(trackingResult, data.plane))
    }
  }

  return (
    <Container maxWidth="md">
      <Box className={classes.container}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={classes.row}>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="x" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting X coordinate"
                    error={Boolean(errors.x)}
                    helperText={errors.x?.message}
                    {...field}
                  />)}
                />
              </Box>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="y" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting Y coordinate"
                    error={Boolean(errors.y)}
                    helperText={errors.y?.message}
                    {...field}
                  />)}
                />
              </Box>
            </Box>
            <Box className={classes.row} pt={1} pb={1}>
              <Controller
                name="plane" control={control} defaultValue={ELYSIUM}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel id="plane-select-label">Select Plane</InputLabel>
                    <Select
                      labelId="plane-select"
                      id="plane-select"
                      label="Select Plane"
                      color="secondary"
                      {...field}
                    >
                      <MenuItem key="elysium" value={ELYSIUM}>Elysium</MenuItem>
                      <MenuItem key="cordillera" value={CORDILLERA}>Cordillera</MenuItem>
                      <MenuItem key="stygia" value={STYGIA}>Stygia</MenuItem>
                      <MenuItem key="generic" value={GENERIC}>Generic</MenuItem>
                    </Select>
                  </FormControl>)}
              />
            </Box>
            <Box className={classes.row}>
              <Controller
                name="revealed" control={control} defaultValue=""
                render={({field}) => (<TextField
                  variant="standard"
                  label="Revealed names, comma separated"
                  error={Boolean(errors.revealed)}
                  helperText={errors.revealed?.message}
                  className={classes.namesInput}
                  {...field}
                />)}
              />
            </Box>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </Box>
    </Container>
  )
}
